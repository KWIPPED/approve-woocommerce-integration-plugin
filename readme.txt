=== Woocommerce Integration Plugin ===
Contributors: Wellington Souza
Donate link: N/A
Tags: approve, kwippped,woocommerce
Requires at least: 4.6
Tested up to: 5.4
Stable tag: 2.0.10
Requires PHP: 5.2.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Provides the necessary structure to retrieve and use KWIPPED APPROVE lender network rates and other information.

== Description ==

The APPROVE Woocommerce integration plugin provides a methodology for Wordpress developers to add the APPROVE 
lender network finance rates, lease cart, and lease application functionality into Woocommerce product pages and cart. 

Each Woocommerce cart implementation is unique to each site, so instead of providing a single solution that may not work for 
your site, we addressed the crux of the problem and created resources for Wordpress developers. Users of the APPROVE Woocommerce 
integration plugin will be able to customize its look and location as needed by the site.

== Installation ==

Download the plugin from the dist folder at  https://github.com/KWIPPED/approve-woocommerce-integration-plugin.

1. Visit the Plugins page of your Wordpress instance and click on "Add New"
1. Click on "Uoload Plugin" and point to the recently downloaded approve-woocommerce-integration-plugin.php file

More informatinon on how to integrate it into your Worpress site is available at https://github.com/KWIPPED/approve-woocommerce-integration-plugin.

== Frequently Asked Questions ==

Please visit https://github.com/KWIPPED/woocommerce-approve-plugin.

== Changelog ==
2.7 =
* Fixed bug causing quantity button not to update the teaser rate on variable product pages.

2.6 =
* Removed some debug code..

2.5 =
* Added approve-woocommerce-add-to-model tag to complement approve-woocommerce-add-to-total.

2.4 =
* Adjustment version - Removed some debug code.

2.3 =
* Added approve-woocommerce-add-to-total tag. This is needed in case there are custom functions on the page that modify the total of the purchase without 
  changing the total of the product.Also, changed the quantity observer added in version 2.2 to also detect keyup events.

2.2 =
* Added functionality to properly change teaser rate and button properties in simple product page when the quantity changes.

2.0.11 =
* Completed ability to utilize composite products. Added technical

2.0.10 =
* Transitional version. No fixes.

2.0.9 =
* Small bug fixes.

2.0.8 =
* Added composite product functionality and the ability to define alternate searches for products.

2.0.7 =
* Added methodologies for retrieving simple product pricing.

2.0.6 =
* Added new minimum value button hide/show feature based on APPROVE KWIPPED settings.

 2.0.5 =
* Temporarily disabled checking for active approve-wordpress-plugin. This is causing issues with some clients.

 2.0.4 =
* Variable product was adding items to cart multiple times.

 2.0.3 =
* Minor bugs.

= 2.0.0 =
* The first publically avaialble version.