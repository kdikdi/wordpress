<?php
/**
 * Options Management Administration Panel.
 *
 * Just allows for displaying of options.
 *
 * This isn't referenced or linked to, but will show all of the options and
 * allow editing. The issue is that serialized data is not supported to be
 * modified. Options can not be removed.
 *
 * @package WordPress
 * @subpackage Administration
 */

/** WordPress Administration Bootstrap */
require_once('admin.php');

$title = __('Settings');
$this_file = 'options.php';
$parent_file = 'options-general.php';

wp_reset_vars(array('action'));

$whitelist_options = array(
	'general' => array('blogname', 'blogdescription', 'admin_email', 'users_can_register', 'gmt_offset', 'date_format', 'time_format', 'start_of_week', 'comment_registration', 'default_role'),
	'discussion' => array( 'default_pingback_flag', 'default_ping_status', 'default_comment_status', 'comments_notify', 'moderation_notify', 'comment_moderation', 'require_name_email', 'comment_whitelist', 'comment_max_links', 'moderation_keys', 'blacklist_keys', 'show_avatars', 'avatar_rating' ),
	'misc' => array( 'hack_file', 'use_linksupdate', 'uploads_use_yearmonth_folders', 'upload_path', 'thumbnail_size_w', 'thumbnail_size_h', 'thumbnail_crop', 'medium_size_w', 'medium_size_h', 'image_default_size', 'image_default_align', 'image_default_link_type', 'large_size_w', 'large_size_h' ),
	'privacy' => array( 'blog_public' ),
	'reading' => array( 'posts_per_page', 'posts_per_rss', 'rss_use_excerpt', 'blog_charset', 'gzipcompression', 'show_on_front', 'page_on_front', 'page_for_posts' ),
	'writing' => array( 'default_post_edit_rows', 'use_smilies', 'ping_sites', 'mailserver_url', 'mailserver_port', 'mailserver_login', 'mailserver_pass', 'default_category', 'default_email_category', 'use_balanceTags', 'default_link_category', 'enable_app', 'enable_xmlrpc' ),
	'options' => array( '' ) );
if ( !defined( 'WP_SITEURL' ) ) $whitelist_options['general'][] = 'siteurl';
if ( defined( 'WP_HOME' ) ) $whitelist_options['general'][] = 'home'; 

$whitelist_options = apply_filters( 'whitelist_options', $whitelist_options );

if ( !current_user_can('manage_options') )
	wp_die(__('Cheatin&#8217; uh?'));

switch($action) {

case 'update':
	$any_changed = 0;

	$option_page = $_POST[ 'option_page' ];
	check_admin_referer( $option_page . '-options' );

	if ( !isset( $whitelist_options[ $option_page ] ) )
		wp_die( __( 'Error! Options page not found.' ) );

	if ( $option_page == 'options' ) {
		$options = explode(',', stripslashes( $_POST[ 'page_options' ] ));
	} else {
		$options = $whitelist_options[ $option_page ];
	}

	if ($options) {
		foreach ($options as $option) {
			$option = trim($option);
			$value = $_POST[$option];
			if(!is_array($value))	$value = trim($value);
			$value = stripslashes_deep($value);
			update_option($option, $value);
		}
	}

	$goback = add_query_arg('updated', 'true', wp_get_referer());
	wp_redirect($goback);
    break;

default:
	include('admin-header.php'); ?>

<div class="wrap">
<ul class="wp-menu">
<?php $array = array(); _wp_menu_output( $submenu['options-general.php'], $array ); unset($array); ?>
</ul>
  <h2><?php _e('All Settings'); ?></h2>
  <form name="form" action="options.php" method="post" id="all-options">
  <?php wp_nonce_field('options-options') ?>
  <input type="hidden" name="action" value="update" />
  <input type='hidden' name='option_page' value='options' />
  <table class="form-table">
<?php
$options = $wpdb->get_results("SELECT * FROM $wpdb->options ORDER BY option_name");

foreach ( (array) $options as $option) :
	$disabled = '';
	$option->option_name = attribute_escape($option->option_name);
	if ( is_serialized($option->option_value) ) {
		if ( is_serialized_string($option->option_value) ) {
			// this is a serialized string, so we should display it
			$value = maybe_unserialize($option->option_value);
			$options_to_update[] = $option->option_name;
			$class = 'all-options';
		} else {
			$value = 'SERIALIZED DATA';
			$disabled = ' disabled="disabled"';
			$class = 'all-options disabled';
		}
	} else {
		$value = $option->option_value;
		$options_to_update[] = $option->option_name;
		$class = 'all-options';
	}
	echo "
<tr>
	<th scope='row'><label for='$option->option_name'>$option->option_name</label></th>
<td>";

	if (strpos($value, "\n") !== false) echo "<textarea class='$class' name='$option->option_name' id='$option->option_name' cols='30' rows='5'>" . wp_specialchars($value) . "</textarea>";
	else echo "<input class='$class' type='text' name='$option->option_name' id='$option->option_name' size='30' value='" . attribute_escape($value) . "'$disabled />";

	echo "</td>
</tr>";
endforeach;
?>
  </table>
<?php $options_to_update = implode(',', $options_to_update); ?>
<p class="submit"><input type="hidden" name="page_options" value="<?php echo $options_to_update; ?>" /><input type="submit" name="Update" value="<?php _e('Save Changes') ?>" /></p>
  </form>
</div>


<?php
break;
} // end switch

include('admin-footer.php');
?>
