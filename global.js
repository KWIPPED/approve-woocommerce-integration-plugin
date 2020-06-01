var approve = approve || {};
approve.ajax_url = php_vars.ajax_url
approve.mode = null;
approve.cart_is_present = false;

approve.update_approve_button = function(){

	//****************************************
	//* If there is a product on the screen.
	//****************************************
	if(approve.mode){
		var info = this.get_woocart_information();
		var data = {action: "get_approve_teaser",data:info};
		jQuery.post(approve.ajax_url,data, function(response) {
			jQuery('[approve-product-button-variable]').each(function(){
				var url = response.url;
				jQuery(this).html(response.teaser);
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.open(url);
				})
			});
			jQuery('[approve-product-button-simple]').each(function(){
				var url = response.url;
				jQuery(this).html(response.teaser);
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.open(url);
				})
			});
		});
	}

	//****************************************
	//* If there is a cart on the screen.
	//****************************************
	if(approve.cart_is_present){
		var data = {'action': 'get_approve_information'};
		jQuery.post(approve.ajax_url,data, function(response) {
			var url = response.url;
			jQuery('[approve-cart-button]').each(function(){
				jQuery(this).html(response.teaser);
				jQuery(this).off('click');
				jQuery(this).click(function(){
					window.open(url);
				})
			});
		});
	}
}

jQuery(document).ready(function(){
	//**********************************************
	//Which type of product do we have on the screen?
	//**********************************************
	if(jQuery('[approve-product-button-simple]').length>0) approve.mode="simple";
	else if(jQuery('[approve-product-button-variable]').length>0) approve.mode="variable";

	if(approve.mode=="simple"){
		approve.get_woocart_information = approve.get_woocart_information_simple;
	}
	else if(approve.mode=="variable"){
		approve.get_woocart_information = approve.get_woocart_information_variable;
	}
	//**********************************************

	if(jQuery('[approve-cart-button]').length>0) approve.cart_is_present = true;

	approve.update_approve_button();
	//For product pages
	jQuery('form.variations_form').on('woocommerce_variation_has_changed', function(){
		approve.update_approve_button();
	});
	//For cart.
	jQuery(document.body).on('updated_cart_totals', function(){
		approve.update_approve_button();
	});
});

/**
 * Uses woocommerce standard cart.
 */
approve.get_woocart_information_variable = function(){
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
approve.get_woocart_information_simple = function(){
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