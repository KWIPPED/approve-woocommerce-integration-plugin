<?php
	/*
	Plugin Name: APPROVE Plugin
	Plugin URI: http://kwipped.com
	description:May be used by APPROVE clients to create the necessary link to connect into the Approve cart.
	Version: 1.0
	Author: Wellington Souza
	Author URI: http://kwipped.com
	License: GPL2
	*/

add_action("wp_ajax_get_approve_information", 'get_approve_information' );
add_action("wp_ajax_nopriv_get_approve_information", "get_approve_information");

$mode = "live";
$landing_page_url= $mode=="test" ? "https://dev.kwipped.com/approve/finance" : "https://www.kwipped.com/approve/finance";
$api_url= $mode=="test" ? "https://dev.kwipped.com/api/v2/approve-widget/finance-teasers/" : "https://www.kwipped.com/api/v2/approve-widget/finance-teasers/" ;
$cacert_file= $mode=="test" ? "/usr/local/etc/openssl/cert.pem" : null;

function get_approve_information() {
	$approve = new Approve();

	//*****************************************************
	//** YOUR CODE GOES IN HERE
	//* For each item in your cart call the following function:
	//* $approve->add(model,price,quantity,type)
	//* If you need information about the specific meaning of each of these fields please visit 
	//* https://kwipped.com/someplacewhereinformationlives
	//*****************************************************
	$kwipped_approve_id="eyJpdiI6ImVMMk1TRWZNeE82RFA5aks0engzZGc9PSIsInZhbHVlIjoibWZpQmhldzhZNnFNRmQ2d0tnQzBuQT09IiwibWFjIjoiYWIwYWUzM2YzOGVmYWZmZjg0YTE0YzFjYjIyNDVkNGVhN2NjZjcxYTM2MDZhMzI4ZTA3YjU5YjJiYWZhYzU3MyJ9";
	
	global $woocommerce;
	$items = $woocommerce->cart->get_cart();
	foreach($items as $item => $values) { 
		//print_r($values); die();
		$approve->add($values['data']->get_name(),get_post_meta($values['product_id'] , '_price', true),$values['quantity'],"new_product");
	}
	//***************************
	//* End of your code
	//***************************

	wp_send_json($approve->get_approve_information($kwipped_approve_id));
	wp_die(); // this is required to terminate immediately and return a proper response
}


//****************************************************************************************
//* You should not modify the code below. It assures the correct format needed by Approve.
//*****************************************************************************************
class Approve{
	private $items = [];
	private $current_total=0;

	public function add($model,$price,$quantity,$type){
		$tmp = [];
		$tmp["model"]=$model;
		$tmp["quantity"]=$quantity;
		$tmp["type"]=$type;
		//In Approve the quantity is a representation of how many items are in the total.
		$tmp["price"]=$price;
		$this->current_total+=($tmp["price"]*$quantity);
		$this->items[]=(object)$tmp;
	}

	
	public function get_approve_information($kwipped_approve_id){
		global $landing_page_url;
		$teaser = "";
		if(function_exists('curl_version')){
			$teaser = $this->get_teaser($this->current_total,$kwipped_approve_id);
		}
		else{
			$teaser = "N/A Your server does not suppor CURL requests. Please ask your system administrator to enable it.";
		}

		return [
			"url"=>$landing_page_url."?approveid=".$kwipped_approve_id.(sizeof($this->items)>0 ? "&items=".json_encode($this->items) : null),
			"teaser"=>$teaser
		];
	}

	//**********************************
	//* Retreieves teasers from KWIPPED.
	//**********************************
	private function get_teaser($amount,$kwipped_approve_id){
		global $api_url, $cacert_file;
		$ch = curl_init();

		curl_setopt($ch, CURLOPT_URL, $api_url.$amount);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
		if(!empty($cacert_file)) curl_setopt ($ch, CURLOPT_CAINFO, $cacert_file);
		//var_dump(openssl_get_cert_locations());
		$headers = array();
		$headers[] = 'Authorization: Basic '.$kwipped_approve_id;
		$headers[] = 'Content-Type: application/json';
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

		$result = curl_exec($ch);
		if (curl_errno($ch)) {
			return 'Error:' . curl_error($ch);
		}
		curl_close($ch);

		$data = json_decode($result);
		$teaser = "As low as $".number_format($data->lease_teaser[0]->monthly_rate,2);
		return $teaser;
	}
}
?>