window.kwipped_approve = window.kwipped_approve || {};
window.kwipped_approve.loader_url = php_vars.loader_url;
window.kwipped_approve.url = php_vars.approve_url;
window.kwipped_approve.approve_id= php_vars.approve_id;
window.kwipped_approve.ajax_url= php_vars.ajax_url;

window.kwipped_approve.mode = null;
window.kwipped_approve.cart_is_present = false;
//********************************************************************
//* Dynamically retreieves WOOCOMMERCE information and updates
//* pertinent tags on the screen. 
//********************************************************************
window.kwipped_approve.update_approve_woocommerce_tags = function(){
	//****************************************
	//* If there is a product on the screen.
	//****************************************
	if(window.kwipped_approve.mode){
		var info = this.get_woocart_information();
		var data = {action: "get_approve_information",data:info};
		jQuery.post(window.kwipped_approve.ajax_url,data, function(response) {
			//*************************************
			//Ignore all teaser rate tags with approve total entries. They will be processed separately.
			jQuery('[approve-function="teaser_rate"]:not([approve-total])').each(function(){
				var url = response.url;
				jQuery(this).html(response.teaser_raw);
			});

			jQuery('[approve-function="hosted_app"][approve-action="add_to_app"][approve-woocommerce-product="simple"]').each(function(){
				var url = response.url;
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.open(url);
				})
			});
			jQuery('[approve-function="embedded_app"][approve-action="add_to_app"][approve-woocommerce-product="simple"]').each(function(){
				//The app reference is placed on the page by the APPROVE plugin, which is a pre-requirement.
				jQuery(this).click(function(){
					window.kwipped_approve.embedded_app.app_reference.add_equipment(response.items)
				});
			});

			jQuery('[approve-function="hosted_app"][approve-action="add_to_app"][approve-woocommerce-product="variable"]').each(function(){
				console.log(response);
				var url = response.url;
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.open(url);
				})
			});
			jQuery('[approve-function="embedded_app"][approve-action="add_to_app"][approve-woocommerce-product="variable"]').each(function(){
				//The app reference is placed on the page by the APPROVE plugin, which is a pre-requirement.
				jQuery(this).click(function(){
					window.kwipped_approve.embedded_app.app_reference.add_equipment(response.items)
				});
			});

		});
	}

	//****************************************
	//* If there is a cart on the screen.
	//****************************************
	if(window.kwipped_approve.cart_is_present){
		var data = {'action': 'get_woocart_approve_information'};
		jQuery.post(window.kwipped_approve.ajax_url,data, function(response) {
			var url = response.url;
			console.log(response);
			jQuery('[approve-woocommerce-cart][approve-function="hosted_app"]').each(function(){
				//jQuery(this).html(response.teaser);
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.open(url);
				})
			});
			jQuery('[approve-woocommerce-cart][approve-function="embedded_app"]').each(function(){
				jQuery(this).click(function(){
					window.kwipped_approve.embedded_app.app_reference.add_equipment(response.items)
				});
			});
			jQuery('[approve-woocommerce-cart][approve-function="teaser_rate"]').each(function(){
				jQuery(this).html(response.teaser_raw);
			});
		});
	}
}

jQuery(document).ready(function(){
	//**********************************************
	//Which type of product do we have on the screen?
	//**********************************************
	if(jQuery('[approve-woocommerce-product="simple"]').length>0) window.kwipped_approve.mode="simple";
	else if(jQuery('[approve-woocommerce-product="variable"]').length>0) window.kwipped_approve.mode="variable";

	if(window.kwipped_approve.mode=="simple"){
		window.kwipped_approve.get_woocart_information = window.kwipped_approve.get_woocart_information_simple;
	}
	else if(window.kwipped_approve.mode=="variable"){
		window.kwipped_approve.get_woocart_information = window.kwipped_approve.get_woocart_information_variable;
	}

	//**********************************************

	if(jQuery('[approve-woocommerce-cart]').length>0) window.kwipped_approve.cart_is_present = true;

	window.kwipped_approve.update_approve_woocommerce_tags();
	//For product pages
	jQuery('form.variations_form').on('woocommerce_variation_has_changed', function(){
		window.kwipped_approve.update_approve_woocommerce_tags();
	});
	// //For cart.
	jQuery(document.body).on('updated_cart_totals', function(){
		window.kwipped_approve.update_approve_woocommerce_tags();
	});
});

/**
 * Uses woocommerce standard cart.
 */
window.kwipped_approve.get_woocart_information_variable = function(){
	var info = {"model":null,"price":null};
	model = jQuery('.product_title').text();
	info.model = model;
	price = jQuery('.woocommerce-variation-price .amount').text().replace(/ /g,'').replace(/\$/g,'').replace(/,/g,''),
	parsePrice  = parseFloat(price),
	totalPrice  = parsePrice.toFixed(2);
	if(!(totalPrice=="NaN")){
		info.price = totalPrice;
	}
	return info;
}

window.kwipped_approve.get_woocart_information_simple = function(){
	var info = {"model":null,"price":null};

	//We will get the price from the structured data avaialble on the page. This was better then 
	//trying to parse HTML to try and see if they had included a sale price, etc.
	//var jsonld = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText);
	jQuery("[type='application/ld+json']").each(function(){
		try{
			// if(jsonld["@graph"][1] && jsonld["@graph"][1]['@type']=="Product"){
			// 	info.price = jsonld["@graph"][1].offers[0].price;
			// 	info.model = jsonld["@graph"][1].name;
			// }
			var jsonld = JSON.parse(jQuery(this).html());
			//Information could be in level 0 or in a graph.
			if(jsonld["@type"] && jsonld["@type"]=="Product"){
				info.price = jsonld.offers[0].price;
				info.model = jsonld.name;
			}
			else if(jsonld["@graph"] && jsonld["@graph"].length){
				for (var j=0; j<jsonld["@graph"].length; j++){
					if(jsonld["@graph"][j]['@type']=="Product"){
						info.price = jsonld["@graph"][j].offers[0].price;
						info.model = jsonld["@graph"][j].name;
						break;
					}
				}
			}
			else{
				console.error("The APPROVE plugin could not find the woocommerce structured data on the page.");
			}
		}
		catch(error){
			console.error("The APPROVE plugin could not parse the page.");
		}
	});
	return info;
}