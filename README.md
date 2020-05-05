# Plugin Features

The APPROVE Woocommerce plugin provides a methodology for Wordpress developers to add the APPROVE lender network finance rates, lease cart, and lease application functionality into the Woocommerce cart. 

Each Woocommerce cart implementation is unique to each site, so instead of providing a single solution that may not work the way you desire, we addressed the crux of the problem, and created resources for Wordpress developers. Users of the APPROVE woocommerce plugin will be able to customize its look and location as needed by the site.


# TL;DR
For experienced programmers.
1. Retrieve your APPROVE id from KWIPPED

2. Download the wordpress plugin from the dist folder in GitHub

3. Install the plugin into Wordpress

4. Set your APPROVE id in the plugin settings. FYI: The plugin provides an AJAX POST uri at admin_url('admin-ajax.php') with action get_approve_information

5. Place a button in the woocommerce product, cart and mini cart pages

  

Simple Product Button:
```
<button approve-product-button-simple>Apply for Financing</button>
```
Variable Product Button:
```
<button approve-product-button-variable>Apply for Financing</button>
```
Cart Button:
```
<button approve-cart-button>Apply for Financing</button>
```
6. Done.

# Detailed Installation Instructions

## 1. Retrieve your APPROVE id from KWIPPED
In order to use the APPROVE woocommerce plugin you will need a subscription to the APPROVE lenger network at KWIPPED. For more information please visit www.kwipped.com
1. Log into KWIPPED
2. Visit the APPROVE settings page
3. Copy your APPROVE id

## 2. Download the wordpress plugin from the dist folder in GitHub
1. In the APPROVE Woocommerce plugin page in GitHub (https://github.com/KWIPPED/approve-woocommerce-plugin) navigate to the dist folder displayed close to the top of the page. Download the approve-woocommerce-plugin.zip to your computer.

## 3. Install the plugin into Wordpress
In Wordpress navigate to the plugins page. Click on "Add New", then "Upload Plugin"
1. Select the file you downloaded on Section #2
2. The APPROVE Woocommerce plugin is now installed.

## 4. Set your APPROVE id in the plugin settings
1. In Wordpress, under "Settings" click on "APPROVE Woocommerce Plugin"
2. Enter your Approve id retrieved in Section #1

## 5. Customize your Woocommerce Cart
Customization of the Woocommerce cart depends on the Wordpress and Woocommerce standards. For information on how to customize the Woocommerce cart, visit https://css-tricks.com/how-to-customize-the-woocommerce-cart-page-on-a-wordpress-site/.

Once the customization template is available, visit the Wordpress template editor. Point to the "Appearance menu" and select "Theme Editor". Select the theme you are currently using (e.g. TwentyTwenty) and navigate to the customizable Woocommerce cart page. This page will be located under woocommerce, cart in your theme, and it will be named cart.php.

In the Woocommerce cart code, place the APPROVE button wherever it may be visible to your clients. In this example, I will place it next to the UPDATE CART button delivered in the standard woocart.
Here is the button code...
```html
<button approve-cart-button>Apply for Financing</button>
```
Style the button as you wish.

Here is the button code (as an example) in cotext withing the standard delivered Woocommerce woocart...

```html
<?php if ( wc_coupons_enabled() ) { ?>
						<div class="coupon">
							<label for="coupon_code"><?php esc_html_e( 'Coupon:', 'woocommerce' ); ?></label> <input type="text" name="coupon_code" class="input-text" id="coupon_code" value="" placeholder="<?php esc_attr_e( 'Coupon code', 'woocommerce' ); ?>" /> <button type="submit" class="button" name="apply_coupon" value="<?php esc_attr_e( 'Apply coupon', 'woocommerce' ); ?>"><?php esc_attr_e( 'Apply coupon', 'woocommerce' ); ?></button>
							<?php do_action( 'woocommerce_cart_coupon' ); ?>
						</div>
					<?php } ?>

					<button type="submit" class="button" name="update_cart" value="<?php esc_attr_e( 'Update cart', 'woocommerce' ); ?>"><?php esc_html_e( 'Update cart', 'woocommerce' ); ?></button>
					
					<button approve-cart-button>Apply for Financing</button>
	
	
					<?php do_action( 'woocommerce_cart_actions' ); ?>
```

## 5. Customize your Woocommerce Product Pages
Woocommerce includes standard pages and steps for the creation of products. Use those steps and place out button wherever you may find best for your design. The followin example is one way to do it, but not the only way. 
__Note:__ We provide two styles of buttons. One for a simple product and one for variable products. For more information on simple and variable products see Woocommerce documentation.

In the Wordpress administration page click on __Producs__, then __Edit__ the product for which you would like a finance button. In the section named "__Product short description__" select __Text__ on the right side of the screen and paste the following code:

For a simple product:

```
<button approve-product-button-simple>Apply for Financing</button>
```

For a variable product:

```
<button approve-product-button-variable>Apply for Financing</button>
```



# Updates

APPROVE Woocommerce plugin updates will be released periodically. You may update it by visiting the "Plugins" page in wordpress and following the provided instructions.
