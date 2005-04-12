<?php
/************************************************************************/
/* ATutor																*/
/************************************************************************/
/* Copyright (c) 2002-2005 by Greg Gay, Joel Kronenberg, Heidi Hazelton	*/
/* http://atutor.ca														*/
/*																		*/
/* This program is free software. You can redistribute it and/or		*/
/* modify it under the terms of the GNU General Public License			*/
/* as published by the Free Software Foundation.						*/
/************************************************************************/
// $Id$

if (!defined('AT_INCLUDE_PATH')) { exit; }

if(isset($_POST['submit'])) {
	unset($_POST['submit']);
	unset($action);
	store_steps($step);
	$step++;
	return;
}

$file = '../include/config.inc.php';

unset($errors);
unset($progress);

if ( file_exists($file) ) {
	@chmod($file, 0666);
	if (!is_writeable($file)) {
		$errors[] = '<strong>' . $file . '</strong> is not writeable.';
	}else{
		$progress[] = '<strong>' . $file . '</strong> is writeable.';
	}
} else {
	$errors[] = '<strong>' . $file . '</strong> does not exist.';
}

print_progress($step);

echo '<form action="'.$_SERVER['PHP_SELF'].'" method="post" name="form">';

if (isset($errors)) {
	if (isset($progress)) {
		print_feedback($progress);
	}
	print_errors($errors);

	echo'<input type="hidden" name="step" value="'.$step.'" />';

	unset($_POST['step']);
	unset($_POST['action']);
	unset($errors);
	print_hidden($step);

	echo '<p><strong>Note:</strong> To change permissions on Unix use <kbd>chmod a+rwx</kbd> then the file or directory name.</p>';

	echo '<p align="center"><input type="submit" class="button" value=" Try Again " name="retry" />';

} else {
	require('include/config_template.php');
		
	$comments = '/*'.str_pad(' This file was generated by the ATutor '.$new_version. ' installation script.', 70, ' ').'*/
/*'.str_pad(' File generated '.date('Y-m-d H:m:s'), 70, ' ').'*/';

	if (!write_config_file('../include/config.inc.php', $comments)) {
		echo '<input type="hidden" name="step" value="'.$step.'" />';

		print_feedback($progress);

		$errors[] = 'include/config.inc.php cannot be written! Please verify that the file exists and is writeable. On Unix issue the command <kbd>chmod a+rwx include/config.inc.php</kbd> to make the file writeable. On Windows edit the file\'s properties ensuring that the <kbd>Read-only</kbd> attribute is <em>not</em> checked and that <kbd>Everyone</kbd> access permissions are given to that file.';
		print_errors($errors);

		echo '<p><strong>Note:</strong> To change permissions on Unix use <kbd>chmod a+rwx</kbd> then the file or directory name.</p>';

		echo '<p align="center"><input type="submit" class="button" value=" Try Again " name="retry" />';

	} else {
		/* if header img and logo were carried forward AND the upgrade was from 1.4.3 to 1.5 then */
		if (($_POST['step1']['header_img'] != '' || $_POST['step1']['header_logo'] != '') 
			&& $new_version == '1.5' && $_POST['step1']['old_version'] == '1.4.3')
			{
				$db = mysql_connect($_POST['step1']['db_host'] . ':' . $_POST['step1']['db_port'], $_POST['step1']['db_login'], $_POST['step1']['db_password']);
				mysql_select_db($_POST['step1']['db_name'], $db);

				$sql = "INSERT INTO ".$_POST['step1']['tb_prefix']."themes VALUES ('ATutor_alt', '1.5', 'default_oldheader', NOW() , 'Backwards compatible default theme', 2)";
				@mysql_query($sql, $db);

				$sql = "UPDATE ".$_POST['step1']['tb_prefix']."themes SET status=0, version='1.5' WHERE dir_name = 'default'";
				@mysql_query($sql, $db);
			}

		echo '<input type="hidden" name="step" value="'.$step.'" />';
		print_hidden($step);

		$progress[] =  'Data has been saved successfully.';

		$cdir = urldecode(trim($_POST['step5']['content_dir']));

		@chmod('../include/config.inc.php', 0444);
		if ($_POST['step4']['welcome_course']) {
			@mkdir($cdir.'/1');
			@mkdir($cdir.'/chat/1');
			@mkdir($cdir.'/backups/1');
			@copy('../images/index.html', $cdir . '/index.html');
			@copy('../images/index.html', $cdir . '/backups/1/index.html');
			@copy('../images/index.html', $cdir . '/chat/1/index.html');
			@copy('../images/index.html', $cdir . '/1/index.html');
		}

		print_feedback($progress);

		echo '<p align="center"><input type="submit" class="button" value=" Next � " name="submit" />';
		
	}
}

?>

</form>