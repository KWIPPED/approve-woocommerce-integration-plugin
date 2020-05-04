<?php
	/*
	Plugin Name: APPROVE Woocommerce Plugin
	Plugin URI: http://kwipped.com
	description:May be used by APPROVE clients to create the necessary link to connect into the Approve cart from a woocommerce cart.
	Version: 1.5.0
	Author: Wellington Souza
	Author URI: http://kwipped.com
	License: GPL2
	*/

	/**
	 * Provides update functionality
	 */
	require 'plugin-update-checker-4.9/plugin-update-checker.php';
	$myUpdateChecker = Puc_v4_Factory::buildUpdateChecker(
		'https://github.com/KWIPPED/approve-woocommerce-plugin/',
		__FILE__,
		'approve-woocommerce-plugin'
	);


	//Include needed script and pass it some variables.
	function load_approve_scripts() {
		$data =[
			"ajax_url" => admin_url("admin-ajax.php")
		];
		wp_enqueue_script('approve_global', plugin_dir_url(__FILE__) . 'global.js', array('jquery'));
		wp_localize_script( 'approve_global', 'php_vars', $data );
	}

	//Get scripts loaded at the right time.
	add_action( 'wp_enqueue_scripts', 'load_approve_scripts' );

	//*****************************************************
	//* Plugin settings : APPROVE Woocommerce Plugin (awcp)
	//*****************************************************
	add_action( 'admin_menu', function() {
		add_options_page( 'APPROVE Woocommerce Plugin Page', 'APPROVE Woocommerce Plugin', 'manage_options', 'approve-woocommerce-plugin', 'awcp_render_plugin_settings_page' );
	});

	function awcp_render_plugin_settings_page() {
		?>
		<h2>APPROVE Woocommerce Plugin Settings</h2>
		<form action="options.php" method="post">
			 <?php 
			 	settings_fields( 'awcp_options' );
				do_settings_sections( 'approve-woocommerce-plugin' ); ?>
			 <input name="submit" class="button button-primary" type="submit" value="<?php esc_attr_e( 'Save' ); ?>" />
		</form>
		<?php
  }

  add_action( 'admin_init', function() {
		register_setting( 'awcp_options', 'awcp_options');
		add_settings_section( 'api_settings', 'API Settings', 'awcp_section_text', 'approve-woocommerce-plugin' );
		add_settings_field( 'approve_id', 'APPROVE id', 'approve_id', 'approve-woocommerce-plugin', 'api_settings' );
	});
	
	function awcp_section_text() {
		echo '<p>Here you can set all the options for using the APPROVE Woocommerce API. Retreive your APPROVE information by logging into KWIPPED.</p>';
  }

  function approve_id() {
		$options = get_option( 'awcp_options');
		echo "<input id='approve_plugin_setting_api_key' name='awcp_options[approve_id]' type='text' value='".esc_attr( $options['approve_id'])."' style='width:100%;'/>";
	}

	//*****************************
	//* Plugin settings END
	//*****************************

	//Will retrieve woocart and return approve rates based on that
	add_action("wp_ajax_get_approve_information", 'get_approve_information' );
	add_action("wp_ajax_nopriv_get_approve_information", "get_approve_information");

	//Will use information passed in data dn return approce rates base on that
	add_action("wp_ajax_get_approve_teaser", 'get_approve_teaser' );
	add_action("wp_ajax_nopriv_get_approve_teaser", "get_approve_teaser");

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
		$kwipped_approve_id=get_option('awcp_options');
		$kwipped_approve_id=$kwipped_approve_id['approve_id'];
		
		global $woocommerce;
		$items = $woocommerce->cart->get_cart();
		foreach($items as $item => $values) { 
			//print_r($values); die();
			$approve->add($values['data']->get_name(),get_post_meta($values['product_id'] , '_price', true),$values['quantity'],"new_product");
		}
		$shipping = $woocommerce->cart->get_shipping_total();
		if(!empty($shipping) && $shipping>0) $approve->add("Shipping",$shipping,1,"shipping");
		//***************************
		//* End of your code
		//***************************

		wp_send_json($approve->get_approve_information($kwipped_approve_id));
		wp_die(); // this is required to terminate immediately and return a proper response
	}

	function get_approve_teaser() {
		$approve = new Approve();
		$kwipped_approve_id=get_option('awcp_options');
		$kwipped_approve_id=$kwipped_approve_id['approve_id'];
		$approve->add($_POST['data']['model'],$_POST['data']['price'],1,"new_product");
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
			if($data->lease_teaser[0]->monthly_rate> 1)
				$teaser = "Finance for $".number_format($data->lease_teaser[0]->monthly_rate,0)."/mo";
			else
				$teaser = "Apply for Financing";
			return $teaser;
		}
}
//Dump to log.
function dd2($item){
	error_log(print_r($item,true));
}
?>
