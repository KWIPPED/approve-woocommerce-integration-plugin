## Version
Current version 2.

[For legacy Version 1 documentation follow this link.](https://github.com/KWIPPED/approve-woocommerce-integration-plugin/tree/4bb4d9353e3762c79cb37187bafeef3849ce2a09)

## Plugin Features

The APPROVE Woocommerce integration plugin provides a methodology for Wordpress developers to add the APPROVE lender network finance rates, lease cart, and lease application functionality into Woocommerce product pages and cart. 

Each Woocommerce cart implementation is unique to each site, so instead of providing a single solution that may not work for your site, we addressed the crux of the problem and created resources for Wordpress developers. Users of the APPROVE Woocommerce integration plugin will be able to customize its look and location as needed by the site.
<BR/><BR/>
__THIS PLUGIN REQUIRES THE INSTALLATION OF THE APPROVE WORDPRESS PLUGIN PLEASE DOWNLOAD, INSTALL AND ACTIVATE IT FIRST. (https://github.com/KWIPPED/approve-wordpress-plugin)__


## TL;DR
For experienced programmers.
1. Donload, install and active the APPROVE Wordpress plugin. (https://github.com/KWIPPED/approve-wordpress-plugin)

2. Download the APPROVE Woocommerce Integration plugin from the dist folder in GitHub (https://github.com/KWIPPED/approve-woocommerce-integration-plugin)

3. Install the plugin into Wordpress

5. Place a button in Woocommerce product, cart and mini cart pages


_FYI: The plugin provides an AJAX POST uri at admin_url('admin-ajax.php') with action get_approve_information_

Simple Product Button Example:
```html
<button 
  approve-function="embedded_app"
  approve-action="add_to_app"
  approve-woocommerce-product="simple"
>Apply For Financing</button>
```
Variable Product Button  Example:
```html
<button 
  approve-function="embedded_app"
  approve-action="add_to_app"
  approve-woocommerce-product="variable"
>
```
Composite Product Button  Example:
```html
<button 
  approve-function="embedded_app"
  approve-action="add_to_app"
  approve-woocommerce-product="composite"
>
```
Cart Button  Example:
```html
<button
  type="button"
  approve-function="embedded_app"
  approve-action="add_to_app"
  approve-woocommerce-cart>Apply for Financing</button>
```

_** Note: The type="button" property is not an APPROVE property. It must be set when a button exists inside of an HTML form and its purspose is anything other than submission._

Teaser Rate Tag  Example:

```html
<span
  approve-function="teaser_rate"
  ></span>/mo Apply For Financing
```
6. Done.

For a full list of APPROVE tags and functionality please visit the [APPROVE documentation](http://approvedocs.kwipped.com/docs/2.0/approve_web_integration#tags).

##Detailed Installation Instructions

### 1. Download the Woocommerce Integration plugin from the dist folder in GitHub
1. In the APPROVE Woocommerce plugin page in GitHub (https://github.com/KWIPPED/approve-woocommerce-integration-plugin) navigate to the dist folder displayed close to the top of the page. Download the approve-woocommerce-plugin.zip to your computer.

### 2. Install the downloaded plugin into Wordpress
In Wordpress navigate to the plugins page. Click on "Add New", then "Upload Plugin"
1. Select the file you downloaded on Section #2
2. The APPROVE Woocommerce Integration plugin is now installed.

### 3. Customize your Woocommerce Cart
Customization of the Woocommerce cart depends on the Wordpress and Woocommerce standards. For information on how to customize the Woocommerce cart, visit https://css-tricks.com/how-to-customize-the-woocommerce-cart-page-on-a-wordpress-site/.

Once the customization template is available, visit the Wordpress template editor. Point to the "Appearance menu" and select "Theme Editor". Select the theme you are currently using (e.g. TwentyTwenty) and navigate to the customizable Woocommerce cart page. This page will be located under woocommerce, cart in your theme, and it will be named cart.php.
<BR/><BR/>
In the Woocommerce cart code, place the APPROVE button wherever it may be visible to your clients. In this example, I will place it next to the UPDATE CART button delivered in the standard woocart.
Here is the button code...
```html
<button type="button" approve-woocommerce-cart approve-function="hosted_app">
	Apply for Financing<BR>
	As low as <span approve-function="teaser_rate" approve-woocommerce-cart></span>/mo
</button>
```
Style the button as you wish.

Here is the button code (as an example) in cotext withing the standard delivered Woocommerce woocart...

```php
<?php if ( wc_coupons_enabled() ) { ?>
<div class="coupon">
		<label for="coupon_code"><?php esc_html_e( 'Coupon:', 'woocommerce' ); ?></label> <input type="text" name="coupon_code" class="input-text" id="coupon_code" value="" placeholder="<?php esc_attr_e( 'Coupon code', 'woocommerce' ); ?>" /> <button type="submit" class="button" name="apply_coupon" value="<?php esc_attr_e( 'Apply coupon', 'woocommerce' ); ?>"><?php esc_attr_e( 'Apply coupon', 'woocommerce' ); ?></button>
		<?php do_action( 'woocommerce_cart_coupon' ); ?>
	</div>
<?php } ?>

<button type="submit" class="button" name="update_cart" value="<?php esc_attr_e( 'Update cart', 'woocommerce' ); ?>"><?php esc_html_e( 'Update cart', 'woocommerce' ); ?></button>

<button type="button" approve-woocommerce-cart approve-function="hosted_app">
	Apply for Financing<BR>
	As low as <span approve-function="teaser_rate" approve-woocommerce-cart></span>/mo
</button>

<?php do_action( 'woocommerce_cart_actions' ); ?>
```

## 4. Customize your Woocommerce Product Pages
Woocommerce includes standard pages and steps for the creation of products. Use those steps and place out button wherever you may find best for your design. The followin example is one way to do it, but not the only way. 
__Note:__ We provide two styles of buttons. One for a simple product and one for variable products. For more information on simple and variable products see Woocommerce documentation.

In the Wordpress administration page click on __Producs__, then __Edit__ the product for which you would like a finance button. In the section named "__Product short description__" select __Text__ on the right side of the screen and paste the following code:

For a simple product:

```html
<button 
  approve-function="hosted_app"
  approve-action="add_to_app"
  approve-woocommerce-product="simple"
>
Apply For Financing</button>

```

For a variable product:

```html
<button 
  approve-function="hosted_app"
  approve-action="add_to_app"
  approve-woocommerce-product="variable"
>
Apply For Financing</button>


```

### Technical Reference
The Woocommerce buttons will for information in standard places on the page. It was designed with the standard Woocommerce templating in place, and it will 
not work well if the template has been highly customized. The following are the standard places the APPROVE Woocommerce integration tag will look for 
information.

<BR/>
#### Simple Product:

1. It will look for product and pricing information inside of the standard structured data dumped in the page by Woocommerce. ( tag property type='application/ld+json'). It looks for a key of **@Type** with a value od **"Product"** to retreive price and product name. If that is not found it will look for a key of **@graph**, which is an array, it will iterate through it, and look for a key of **@type** and the value of **"Product"**. If it finds it, it will retreieve the product name and price from there. 
2. If no data if found on step 1, then it will look for the tags with following properties on the page, which are also placed on the page automatically by Woocommerce. and retreive the price and product names from it.
```
property='og:title'"
property='product:price:amount'
```

Example:

```html
<meta property="og:title" content="Product 1" />
<meta property="product:price:amount" content="6375"/>
```

3. If no data is found on steps 1 and 2, it will try to search for the content of the alternate tags provided programatically by you. The names of the variables needed are the following:

```javascript
window.kwipped_approve.simple_product_alternate_model_search
window.kwipped_approve.simple_product_alternate_price_search
```

Example:

```javascript
window.kwipped_approve.simple_product_alternate_model_search = ['.heading-text','h1'];
window.kwipped_approve.simple_product_alternate_price_search = ['.entry-summary','.price'];
```

The plugin will look for each of the items provided in the array, in order, and take the content of the found object.

<BR/>
#### Variable Product

1. It will look for product name inside of a tag containing the class **.product_title**. It will look for pricing information in the following tag hierarchy: **.woocommerce-variation-price**, then **.amount**.
2. If the product name or price were not found, it will look for the missing information (only the missing information) in the the alternate tags provided programatically by you. The names of the variables needed are the following:

```javascript
window.kwipped_approve.variable_product_alternate_model_search
window.kwipped_approve.variable_product_alternate_price_search
```

Example:

```javascript
window.kwipped_approve.variable_product_alternate_model_search = ['.heading-text','h1'];
window.kwipped_approve.variable_product_alternate_price_search = ['.example','.price'];
```

<BR/>
#### Composite Product

The integration plugin has no default methodology to find composite product infomrmation. You must utilize the alternate tags provided programatically by you. The names of the variables needed are the following:

```javascript
window.kwipped_approve.variable_product_alternate_model_search
window.kwipped_approve.variable_product_alternate_price_search
```

Example:

```javascript
window.kwipped_approve.composite_product_alternate_model_search = ['.heading-text','h1'];
window.kwipped_approve.composite_product_alternate_price_search = ['.example','.price'];
```

<BR/>
#### IMPORTANT NOTE ON COMPOSITE PRODUCTS:

Our code needs to know that the composite product was updated when the user makes choices. The following code should be dropped in the composite product page, and it will alert our plugin that something has changed when the user interacts with the page.

```javascript
$( '.composite_data' ).on( 'wc-composite-initializing', function( event, composite ) {
	composite.actions.add_action('active_step_changed',function(){
		window.kwipped_approve.update_approve_woocommerce_tags();
		});
});
```

Documentation for Woocommerce composite product API is available at [Woocommerce](https://docs.woocommerce.com/document/composite-products/composite-products-js-api-reference/) site.


<BR/>
# Updates

APPROVE Woocommerce plugin updates will be released periodically. You may update it by visiting the "Plugins" page in wordpress and following the provided instructions.