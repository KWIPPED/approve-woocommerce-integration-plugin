#TL;DR#
For experienced programmers.
1. Retrieve your APPROVE id from KWIPPED
2. Download the wordpress plugin from the dist folder
3. . Install the plugin into Wordpress
4. Set your APPROVE id in the plugin settings
3. The plugin provides an AJAX POST uri at admin_url('admin-ajax.php') with action get_approve_information
4. Place the following javascript in the woocommerce cart and mini cart
```
<script>
//***********************************
//* Added by KWIPPED
//***********************************
 	if(!window.approve_custom_code_initialized){
		window.approve_custom_code_initialized = true;
		function update_approve_button(){
			var data = {'action': 'get_approve_information'};
			jQuery.post('<?php echo admin_url('admin-ajax.php'); ?>' ,data, function(response) {
				jQuery('[custom-approve-button]').each(function(){
					jQuery(this).html(response.teaser);
					jQuery(this).attr('href',response.url);
				});
			});
	   }
	   jQuery(document).ready(function() {
		  update_approve_button();
	   });
	   jQuery(document.body).on( 'updated_cart_totals', function(){
		   update_approve_button();
	   });
	}
//******************************
//* End of added by KWIPPED
//*******************************
</script>
```
5. Place a button in the woocommerce cart and mini cart. (Replace your APPROVE ID)

```
<a href="https://www.kwipped.com/approve/finance?approveid=<?php echo (get_option('awcp_options'))['approve_id']; ?>" class="gem-button gem-button-size-medium gem-button-style-flat gem-button-text-weight-normal checkout-button button alt wc-forward" target="_blank" custom-approve-button >Apply for Financing</a>
```
6. Done.

#Detailed Installation Instructions#
