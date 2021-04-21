<?php
	/*
	Plugin Name: APPROVE Woocommerce Integration Plugin
	Plugin URI: http://kwipped.com
	description:May be used by APPROVE clients to create the necessary link to connect into the Approve cart from wordpress.
	Version: 2.6
	Author: Wellington Souza
	Author URI: http://kwipped.com
	License: GPL2
	*/
	require('ApproveWoocommerce.php');
	//Required so I can use the is_plugin_active function.
	include_once(ABSPATH.'wp-admin/includes/plugin.php');
	
	class ApproveWoocommerceIntegrationPlugin{

		private $version = "2.6";
		private $test = false;

		function __construct(){
			/**
			 * Provides update functionality
			 */
			require 'plugin-update-checker-4.9/plugin-update-checker.php';
			$myUpdateChecker = Puc_v4_Factory::buildUpdateChecker(
				'https://github.com/KWIPPED/approve-woocommerce-integration-plugin/',
				__FILE__,
				'approve-woocommerce-integration-plugin'
			);

			//During the activation of the plugin, we will make sure the required base plugin (approve wordpress plugin)
			//is available. If not, we will throw an error, which will stop the activation and display the throw message
			//to the user.
			register_activation_hook(__FILE__, function(){
				// This was not working, so I temporarily disabled it. WOD 7.20.
				// if(!is_plugin_active( 'approve-wordpress-plugin/approve-wordpress-plugin.php' )){
				// 	die("The APPROVE WordPress Plugin is required. Please install and activate that plugin first.");
				// }
			});

			 add_action('wp_enqueue_scripts',array($this,'load_scripts'));

			// //Will use information simple/variable products.
			add_action("wp_ajax_get_approve_information",[$this,'get_approve_information']);
			add_action("wp_ajax_nopriv_get_approve_information",[$this,'get_approve_information']);

			// //Will retrieve woocart and return approve rates based on that
			add_action("wp_ajax_get_woocart_approve_information", [$this,'get_woocart_approve_information']);
			add_action("wp_ajax_nopriv_get_woocart_approve_information",[$this,"get_woocart_approve_information"]);
		}
		
		//***********************************************************************
		//* The following functions will load all needed WORDPRESS settings, etc.
		//***********************************************************************
		public function load_scripts() {
			//The ApproveWordPressPlugin is a requirement for this plugin.
			$settings =  ApproveWordpressPlugin::get_settings();
			$data =[
				"ajax_url" => admin_url("admin-ajax.php"),
				"approve_id"=>$settings->approve_id,
				"loader_url"=>$settings->loader_url,
				"approve_url"=>$settings->approve_url,
			];
			wp_enqueue_script('approve_woocommerce_integration_plugin', plugin_dir_url(__FILE__) .
				'approve_woocommerce_integration_plugin.js', array('jquery'),$this->version);
			wp_localize_script( 'approve_woocommerce_integration_plugin', 'php_vars', $data );
		}

		/**
		 * Returns information for single/variable product pages.
		 */
		function get_approve_information() {
			$settings =  ApproveWordpressPlugin::get_settings();
			$settings->test = $this->test;
			$approve = new ApproveWoocommerce($settings);
			$approve->add($_POST['data']['model'],$_POST['data']['price'],$_POST['data']['qty'],"new_product");
			//***************************
			//* End of your code
			//***************************
			wp_send_json($approve->get_approve_information());
			wp_die(); // this is required to terminate immediately and return a proper response
		}

		/**
		 * Returns information for woocart items.
		 */
		public function get_woocart_approve_information() {
			$settings =  ApproveWordpressPlugin::get_settings();
			$settings->test = $this->test;
			$approve = new ApproveWoocommerce($settings);
			//*****************************************************
			//** WOOCOMMERCE SPECIFIC CODE
			//*****************************************************
			global $woocommerce;
			$items = $woocommerce->cart->get_cart();
			foreach($items as $item => $values) { 
				//print_r($values); die();
				$approve->add($values['data']->get_name(),$values['data']->get_price(),$values['quantity'],"new_product");
			}
			$shipping = $woocommerce->cart->get_shipping_total();
			if(!empty($shipping) && $shipping>0) $approve->add("Shipping",$shipping,1,"shipping");
			//*****************************************************
			//** END WOOCOMMERCE SPECIFIC CODE
			//*****************************************************
			wp_send_json($approve->get_approve_information());
			wp_die(); // this is required to terminate immediately and return a proper response
		}

		function dd2($item){
			error_log(print_r($item,true));
		}

	}
	$approve_woocommerce_integration_plugin = new ApproveWoocommerceIntegrationPlugin();
?>
