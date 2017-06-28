$(document).ready(function() {
	$(".open-menu-trigger").sideNav();
	$("#content").load('./projects.html');

	$(".projets-link").click(function(){
    $("#content").load('./projects.html');
});
});
