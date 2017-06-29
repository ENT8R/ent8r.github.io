$(document).ready(function() {
	$(".open-menu-trigger").sideNav();
	$("#content").load('./projects.html');

	$(".projets-link").click(function(){
    $("#content").load('./projects.html');
	});

	i18next.use(window.i18nextBrowserLanguageDetector).use(window.i18nextXHRBackend).init({
			backend: {
          loadPath: './locales/{{lng}}/translation.json'
      }
	}, function(err, t) {
		jqueryI18next.init(i18next, $, {
			tName: 't',
		  i18nName: 'i18n',
		  handleName: 'localize',
		  selectorAttr: 'data-i18n',
		  targetAttr: 'i18n-target',
		  optionsAttr: 'i18n-options',
		  useOptionsAttr: false,
		  parseDefaultValueFromContent: true
		});
		$('#content').localize();
		$('nav').localize();
		$('#SideMenu').localize();
	});

});
