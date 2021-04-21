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
				//The following is placed on the button so the show/hide based on minimum values will work.
				jQuery(this).attr('approve-items',JSON.stringify(response.items));
			});
			jQuery('[approve-function="embedded_app"][approve-action="add_to_app"][approve-woocommerce-product="simple"]').each(function(){
				//The app reference is placed on the page by the APPROVE plugin, which is a pre-requirement.'
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.kwipped_approve.embedded_app.app_reference.add_equipment(response.items)
				});
				//The following is placed on the button so the show/hide based on minimum values will work.
				jQuery(this).attr('approve-items',JSON.stringify(response.items));
			});

			jQuery('[approve-function="hosted_app"][approve-action="add_to_app"][approve-woocommerce-product="variable"]').each(function(){
				var url = response.url;
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.open(url);
				})
				//The following is placed on the button so the show/hide based on minimum values will work.
				jQuery(this).attr('approve-items',JSON.stringify(response.items));
			});
			jQuery('[approve-function="embedded_app"][approve-action="add_to_app"][approve-woocommerce-product="variable"]').each(function(){
				//The app reference is placed on the page by the APPROVE plugin, which is a pre-requirement.
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.kwipped_approve.embedded_app.app_reference.add_equipment(response.items)
				});
				//The following is placed on the button so the show/hide based on minimum values will work.
				jQuery(this).attr('approve-items',JSON.stringify(response.items));
			});

			jQuery('[approve-function="hosted_app"][approve-action="add_to_app"][approve-woocommerce-product="composite"]').each(function(){
				var url = response.url;
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.open(url);
				})
				//The following is placed on the button so the show/hide based on minimum values will work.
				jQuery(this).attr('approve-items',JSON.stringify(response.items));
			});
			jQuery('[approve-function="embedded_app"][approve-action="add_to_app"][approve-woocommerce-product="composite"]').each(function(){
				//The app reference is placed on the page by the APPROVE plugin, which is a pre-requirement.
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.kwipped_approve.embedded_app.app_reference.add_equipment(response.items)
				});
				//The following is placed on the button so the show/hide based on minimum values will work.
				jQuery(this).attr('approve-items',JSON.stringify(response.items));
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
			jQuery('[approve-woocommerce-cart][approve-function="hosted_app"]').each(function(){
				//jQuery(this).html(response.teaser);
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.open(url);
				})
				//The following is placed on the button so the show/hide based on minimum values will work.
				jQuery(this).attr('approve-items',JSON.stringify(response.items));
				//IMPORTANT - The cart will be refreshed on the screen when the totals update. The standard mutation observer
				//for the show/hide function gets wiped out when that happens. For this reason, the core code ignores the cart,
				//which calls the show_hide function directly every time there is an update.
				if(window.kwipped_approve && window.kwipped_approve.core){
					window.kwipped_approve.core.show_hide(this);
				}
			});
			jQuery('[approve-woocommerce-cart][approve-function="embedded_app"]').each(function(){
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.kwipped_approve.embedded_app.app_reference.add_equipment(response.items)
				});
				//The following is placed on the button so the show/hide based on minimum values will work.
				jQuery(this).attr('approve-items',JSON.stringify(response.items));
				//IMPORTANT - The cart will be refreshed on the screen when the totals update. The standard mutation observer
				//for the show/hide function gets wiped out when that happens. For this reason, the core code ignores the cart,
				//which calls the show_hide function directly every time there is an update.
				if(window.kwipped_approve && window.kwipped_approve.core){
					window.kwipped_approve.core.show_hide(this);
				}
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
	else if(jQuery('[approve-woocommerce-product="composite"]').length>0) window.kwipped_approve.mode="composite";

	if(window.kwipped_approve.mode=="simple"){
		window.kwipped_approve.get_woocart_information = window.kwipped_approve.get_woocart_information_simple;
	}
	else if(window.kwipped_approve.mode=="variable"){
		window.kwipped_approve.get_woocart_information = window.kwipped_approve.get_woocart_information_variable;
	}
	else if(window.kwipped_approve.mode=="composite"){
		window.kwipped_approve.get_woocart_information = window.kwipped_approve.get_woocart_information_composite;
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

	//Quantity in simple product pages.
	if(window.kwipped_approve.mode==="simple"){
		jQuery('[name="quantity"]').change(function(){
			window.kwipped_approve.update_approve_woocommerce_tags();
		});
		jQuery('[name="quantity"]').keyup(function(){
			window.kwipped_approve.update_approve_woocommerce_tags();
		});
	}

	//***********************************************************************************
	//If there is a tag on the page with add-to-total, then we will watch if for changes.
	//***********************************************************************************
	if(jQuery('approve-woocommerce-add-to-total').length){
		var add_to_total = jQuery('approve-woocommerce-add-to-total').get(0);
		approve_set_mutation_watcher(add_to_total,function(){
			window.kwipped_approve.update_approve_woocommerce_tags();
		});
	}
	if(jQuery('approve-woocommerce-add-to-model').length){
		var add_to_model = jQuery('approve-woocommerce-add-to-model').get(0);
		approve_set_mutation_watcher(add_to_model,function(){
			window.kwipped_approve.update_approve_woocommerce_tags();
		});
	}
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
	//******************************************************************************************
	// If a custom search is provided
	// If we have not found a model in the regular place we will let the user give us a selector.
	//******************************************************************************************
	if(!info.model){
		if(window.kwipped_approve.variable_product_alternate_model_search && window.kwipped_approve.variable_product_alternate_model_search.length){
			var el=jQuery(window.kwipped_approve.variable_product_alternate_model_search[0]);
			for(i=1;i<window.kwipped_approve.variable_product_alternate_model_search.length;i++){
				el=el.find(window.kwipped_approve.variable_product_alternate_model_search[i]);
			}
			info.model = el.text();
		}
	}
	if(!info.price){
		if(window.kwipped_approve.variable_product_alternate_price_search && window.kwipped_approve.variable_product_alternate_price_search.length){
			var el=jQuery(window.kwipped_approve.variable_product_alternate_price_search[0]);
			for(i=1;i<window.kwipped_approve.variable_product_alternate_price_search.length;i++){
				el=el.find(window.kwipped_approve.variable_product_alternate_price_search[i]);
			}
			info.price = el.text().replace(/ /g,'').replace(/\$/g,'').replace(/,/g,'');
		}
	}

	info.qty = 1;

	//Is there any value on the page that needs to be added to the total?
	var add_to_total = jQuery('approve-woocommerce-add-to-total').text();
	if(add_to_total){
			add_to_total = add_to_total.replace(/ /g,'').replace(/\$/g,'').replace(/,/g,'');
			info.price=parseFloat(info.price)+parseFloat(add_to_total);
	}
	//Is there any descriptiopn on the page that needs to be added to the model?
	var add_to_model = jQuery('approve-woocommerce-add-to-model').text();
	if(add_to_model){
			info.model+=" "+add_to_model;
	}

	return info;
}

window.kwipped_approve.get_woocart_information_simple = function(){
	var info = {"model":null,"price":null};

	//We will get the price from the structured data avaialble on the page. This was better then 
	//trying to parse HTML to try and see if they had included a sale price, etc.
	var found_data = false;
	jQuery("[type='application/ld+json']").each(function(){
		try{
			var jsonld = JSON.parse(jQuery(this).html());
			//Information could be in level 0 or in a graph.
			if(jsonld["@type"] && jsonld["@type"]=="Product"){
				info.price = jsonld.offers[0].price;
				info.model = jsonld.name;
				found_data = true;
			}
			else if(jsonld["@graph"] && jsonld["@graph"].length){
				for (var j=0; j<jsonld["@graph"].length; j++){
					if(jsonld["@graph"][j]['@type']=="Product"){
						info.price = jsonld["@graph"][j].offers[0].price;
						info.model = jsonld["@graph"][j].name;
						found_data = true;
						break;
					}
				}
			}
		}
		catch(error){
			//Do nothing for now.
			//console.error("The APPROVE plugin could not parse the page.");
		}
	});
	//If the data was not found in structured data, we will try metadata on the page.
	if(!found_data){
		var metadata_model = jQuery("[property='og:title'").attr('content');
		var metadata_price = jQuery("[property='product:price:amount'").attr('content');
		if(metadata_model && metadata_price){
			info.price = metadata_price.replace(/ /g,'').replace(/\$/g,'').replace(/,/g,'');
			info.model = metadata_model;
			found_data = true;
		}
	}
	//If the data was not found we will try a custom search.
	if(!found_data){
		var model = null;
		var price = null;
		if(window.kwipped_approve.simple_product_alternate_model_search && window.kwipped_approve.simple_product_alternate_model_search.length){
			var el=jQuery(window.kwipped_approve.simple_product_alternate_model_search[0]);
			for(i=1;i<window.kwipped_approve.simple_product_alternate_model_search.length;i++){
				el=el.find(window.kwipped_approve.simple_product_alternate_model_search[i]);
			}
			model = el.text();
		}
		if(window.kwipped_approve.simple_product_alternate_price_search && window.kwipped_approve.simple_product_alternate_price_search.length){
			var el=jQuery(window.kwipped_approve.simple_product_alternate_price_search[0]);
			for(i=1;i<window.kwipped_approve.simple_product_alternate_price_search.length;i++){
				el=el.find(window.kwipped_approve.simple_product_alternate_price_search[i]);
			}
			price = el.text().replace(/ /g,'').replace(/\$/g,'').replace(/,/g,'');
		}
		if(model && price){
			info.price = price.replace(/ /g,'').replace(/\$/g,'').replace(/,/g,'');
			info.model = model;
			found_data = true;
		}
	}

	//If all else failed, we will alert ourselves.
	if(!found_data){
		console.error("The APPROVE plugin could not find the woocommerce structured data on the page.");
	}

	//We have found the data and we are on a simple page. Now let's get the quantity.
	//It is not that important that we will break the function if we don't find it.
	var qty = jQuery('[name="quantity"]').val();
	if(qty){
		info.qty = qty;
	}
	else{
		info.qty = 1;
	}

	//Is there any value on the page that needs to be added to the total?
	var add_to_total = jQuery('approve-woocommerce-add-to-total').text();
	if(add_to_total){
			add_to_total = add_to_total.replace(/ /g,'').replace(/\$/g,'').replace(/,/g,'');
			info.price=parseFloat(info.price)+parseFloat(add_to_total);
	}
	//Is there any descriptiopn on the page that needs to be added to the model?
	var add_to_model = jQuery('approve-woocommerce-add-to-model').text();
	if(add_to_model){
			info.model+=" "+add_to_model;
	}

	return info;
}

window.kwipped_approve.get_woocart_information_composite = function(){
	var info = {"model":null,"price":null};

	var model = null;
	var price = null;
	if(window.kwipped_approve.composite_product_alternate_model_search && window.kwipped_approve.composite_product_alternate_model_search.length){
		var el=jQuery(window.kwipped_approve.composite_product_alternate_model_search[0]);
		for(i=1;i<window.kwipped_approve.composite_product_alternate_model_search.length;i++){
			el=el.find(window.kwipped_approve.composite_product_alternate_model_search[i]);
		}
		model = el.text();
	}
	if(window.kwipped_approve.composite_product_alternate_price_search && window.kwipped_approve.composite_product_alternate_price_search.length){
		var el=jQuery(window.kwipped_approve.composite_product_alternate_price_search[0]);
		for(i=1;i<window.kwipped_approve.composite_product_alternate_price_search.length;i++){
			el=el.find(window.kwipped_approve.composite_product_alternate_price_search[i]);
		}
		price = el.text().replace(/ /g,'').replace(/\$/g,'').replace(/,/g,'');
	}
	if(model && price){
		info.price = price;
		info.model = model;
	}

	info.qty = 1;

	//Is there any value on the page that needs to be added to the total?
	var add_to_total = jQuery('approve-woocommerce-add-to-total').text();
	if(add_to_total){
			add_to_total = add_to_total.replace(/ /g,'').replace(/\$/g,'').replace(/,/g,'');
			info.price=parseFloat(info.price)+parseFloat(add_to_total);
	}
	//Is there any descriptiopn on the page that needs to be added to the model?
	var add_to_model = jQuery('approve-woocommerce-add-to-model').text();
	if(add_to_model){
			info.model+=" "+add_to_model;
	}

	return info;
}

function approve_set_mutation_watcher(element,action){
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	var observer = new MutationObserver(function(mutations) {
		action();
	});
	observer.observe(element,{childList:true});
}