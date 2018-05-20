/* globals M */

document.addEventListener('DOMContentLoaded', () => {
  const sideNav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(sideNav);
});

const Projects = (() => {
  const me = {};

  function build(url, language) {
    Helper.request(url, (result) => {
      const project = generate(JSON.parse(result));

      const section = document.getElementById(language);
      section.innerHTML += project;
      Localizer.init();
    });
  }

  function generate(json) {
    const links = generateLinks(json.links);
    const template = `
    <div class="col s12 m6 l4">
      <div class="card hoverable">
        <div class="card-image">
          <img src="${json.image}"></img>
        </div>
        <div class="card-content">
          <span class="card-title activator orange-text text-lighten-1">${json.name}</span>
          <p data-i18n="${json.description}"></p>
        </div>
        <div class="card-action">
          ${links}
        </div>
      </div>
    </div>`;
    return template;
  }

  function generateLinks(links) {
    let result = '';
    for (let i = 0; i < links.length; i++) {
      let template = '';
      if (!links[i].href) {
        template = `<a href="#" data-i18n="${links[i].content}" rel="noopener"></a>`;
      } else {
        template = `<a href="${links[i].href}" target="_blank" data-i18n="${links[i].content}" rel="noopener"></a>`;
      }

      result += '\n';
      result += template;
    }
    return result;
  }

  me.init = function() {
    Helper.request('./projects/index.json', (result) => {
      result = JSON.parse(result);

      for (const language in result) {
        if (result.hasOwnProperty(language)) {
          const projects = result[language];
          for (let i = 0; i < projects.length; i++) {
            build(projects[i], language);
          }
        }
      }
    });
  };

  return me;
})();

const Localizer = (function() {
  const me = {};

  const I18N_ATTRIBUTE = 'data-i18n';

  let translations;

  function replaceI18n(elem, tag) {
    // localize main content
    if (tag !== '') {
      const isHTML = tag.startsWith('[html]');
      if (isHTML) {
        tag = tag.replace('[html]', '');
      }
      const translatedMessage = getMessage(tag);
      if (translatedMessage !== '') {
        if (isHTML) {
          elem.innerHTML = translatedMessage;
        } else {
          elem.textContent = translatedMessage;
        }
      }
    }
  }

  function getMessage(tag) {
    const t = translations[getLanguage()];
    return getProperty(tag, t);
  }

  function getLanguage() {
    const language = navigator.language || navigator.userLanguage;
    return language.split('-')[0];
  }

  function getProperty(propertyName, object) {
    const parts = propertyName.split('.');
    let property = object;
    for (let i = 0; i < parts.length; i++) {
      property = property[parts[i]];
    }
    return property;
  }

  me.init = function(strings) {
    if (!strings && !translations) {
      return;
    }
    if (!translations) {
      translations = strings;
    }
    document.querySelectorAll(`[${I18N_ATTRIBUTE}]`).forEach((currentElem) => {
      const contentString = currentElem.getAttribute(I18N_ATTRIBUTE);
      replaceI18n(currentElem, contentString);
    });

    // replace html lang attribut after translation
    document.querySelector('html').setAttribute('lang', getLanguage());
  };

  return me;
})();


const Helper = (() => {
  const me = {};

  me.request = function(url, callback) {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        if (callback) {
          callback(http.responseText);
        }
      }
    };
    http.open('GET', url, true);
    http.send();
  };

  return me;
})();

Helper.request('./locales/strings.json', (result) => {
  Localizer.init(JSON.parse(result));
});
Projects.init();
