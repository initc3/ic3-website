 /*
 * # Fomantic UI - 2.8.6
 * https://github.com/fomantic/Fomantic-UI
 * http://fomantic-ui.com/
 *
 * Copyright 2014 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
/*!
 * # Fomantic-UI - Site
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

$.isFunction = $.isFunction || function(obj) {
    return typeof obj === "function" && typeof obj.nodeType !== "number";
};

$.site = $.fn.site = function(parameters) {
  var
    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),

    settings        = ( $.isPlainObject(parameters) )
      ? $.extend(true, {}, $.site.settings, parameters)
      : $.extend({}, $.site.settings),

    namespace       = settings.namespace,
    error           = settings.error,

    moduleNamespace = 'module-' + namespace,

    $document       = $(document),
    $module         = $document,
    element         = this,
    instance        = $module.data(moduleNamespace),

    module,
    returnedValue
  ;
  module = {

    initialize: function() {
      module.instantiate();
    },

    instantiate: function() {
      module.verbose('Storing instance of site', module);
      instance = module;
      $module
        .data(moduleNamespace, module)
      ;
    },

    normalize: function() {
      module.fix.console();
      module.fix.requestAnimationFrame();
    },

    fix: {
      console: function() {
        module.debug('Normalizing window.console');
        if (console === undefined || console.log === undefined) {
          module.verbose('Console not available, normalizing events');
          module.disable.console();
        }
        if (typeof console.group == 'undefined' || typeof console.groupEnd == 'undefined' || typeof console.groupCollapsed == 'undefined') {
          module.verbose('Console group not available, normalizing events');
          window.console.group = function() {};
          window.console.groupEnd = function() {};
          window.console.groupCollapsed = function() {};
        }
        if (typeof console.markTimeline == 'undefined') {
          module.verbose('Mark timeline not available, normalizing events');
          window.console.markTimeline = function() {};
        }
      },
      consoleClear: function() {
        module.debug('Disabling programmatic console clearing');
        window.console.clear = function() {};
      },
      requestAnimationFrame: function() {
        module.debug('Normalizing requestAnimationFrame');
        if(window.requestAnimationFrame === undefined) {
          module.debug('RequestAnimationFrame not available, normalizing event');
          window.requestAnimationFrame = window.requestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(callback) { setTimeout(callback, 0); }
          ;
        }
      }
    },

    moduleExists: function(name) {
      return ($.fn[name] !== undefined && $.fn[name].settings !== undefined);
    },

    enabled: {
      modules: function(modules) {
        var
          enabledModules = []
        ;
        modules = modules || settings.modules;
        $.each(modules, function(index, name) {
          if(module.moduleExists(name)) {
            enabledModules.push(name);
          }
        });
        return enabledModules;
      }
    },

    disabled: {
      modules: function(modules) {
        var
          disabledModules = []
        ;
        modules = modules || settings.modules;
        $.each(modules, function(index, name) {
          if(!module.moduleExists(name)) {
            disabledModules.push(name);
          }
        });
        return disabledModules;
      }
    },

    change: {
      setting: function(setting, value, modules, modifyExisting) {
        modules = (typeof modules === 'string')
          ? (modules === 'all')
            ? settings.modules
            : [modules]
          : modules || settings.modules
        ;
        modifyExisting = (modifyExisting !== undefined)
          ? modifyExisting
          : true
        ;
        $.each(modules, function(index, name) {
          var
            namespace = (module.moduleExists(name))
              ? $.fn[name].settings.namespace || false
              : true,
            $existingModules
          ;
          if(module.moduleExists(name)) {
            module.verbose('Changing default setting', setting, value, name);
            $.fn[name].settings[setting] = value;
            if(modifyExisting && namespace) {
              $existingModules = $(':data(module-' + namespace + ')');
              if($existingModules.length > 0) {
                module.verbose('Modifying existing settings', $existingModules);
                $existingModules[name]('setting', setting, value);
              }
            }
          }
        });
      },
      settings: function(newSettings, modules, modifyExisting) {
        modules = (typeof modules === 'string')
          ? [modules]
          : modules || settings.modules
        ;
        modifyExisting = (modifyExisting !== undefined)
          ? modifyExisting
          : true
        ;
        $.each(modules, function(index, name) {
          var
            $existingModules
          ;
          if(module.moduleExists(name)) {
            module.verbose('Changing default setting', newSettings, name);
            $.extend(true, $.fn[name].settings, newSettings);
            if(modifyExisting && namespace) {
              $existingModules = $(':data(module-' + namespace + ')');
              if($existingModules.length > 0) {
                module.verbose('Modifying existing settings', $existingModules);
                $existingModules[name]('setting', newSettings);
              }
            }
          }
        });
      }
    },

    enable: {
      console: function() {
        module.console(true);
      },
      debug: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Enabling debug for modules', modules);
        module.change.setting('debug', true, modules, modifyExisting);
      },
      verbose: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Enabling verbose debug for modules', modules);
        module.change.setting('verbose', true, modules, modifyExisting);
      }
    },
    disable: {
      console: function() {
        module.console(false);
      },
      debug: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Disabling debug for modules', modules);
        module.change.setting('debug', false, modules, modifyExisting);
      },
      verbose: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Disabling verbose debug for modules', modules);
        module.change.setting('verbose', false, modules, modifyExisting);
      }
    },

    console: function(enable) {
      if(enable) {
        if(instance.cache.console === undefined) {
          module.error(error.console);
          return;
        }
        module.debug('Restoring console function');
        window.console = instance.cache.console;
      }
      else {
        module.debug('Disabling console function');
        instance.cache.console = window.console;
        window.console = {
          clear          : function(){},
          error          : function(){},
          group          : function(){},
          groupCollapsed : function(){},
          groupEnd       : function(){},
          info           : function(){},
          log            : function(){},
          markTimeline   : function(){},
          warn           : function(){}
        };
      }
    },

    destroy: function() {
      module.verbose('Destroying previous site for', $module);
      $module
        .removeData(moduleNamespace)
      ;
    },

    cache: {},

    setting: function(name, value) {
      if( $.isPlainObject(name) ) {
        $.extend(true, settings, name);
      }
      else if(value !== undefined) {
        settings[name] = value;
      }
      else {
        return settings[name];
      }
    },
    internal: function(name, value) {
      if( $.isPlainObject(name) ) {
        $.extend(true, module, name);
      }
      else if(value !== undefined) {
        module[name] = value;
      }
      else {
        return module[name];
      }
    },
    debug: function() {
      if(settings.debug) {
        if(settings.performance) {
          module.performance.log(arguments);
        }
        else {
          module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
          module.debug.apply(console, arguments);
        }
      }
    },
    verbose: function() {
      if(settings.verbose && settings.debug) {
        if(settings.performance) {
          module.performance.log(arguments);
        }
        else {
          module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
          module.verbose.apply(console, arguments);
        }
      }
    },
    error: function() {
      module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
      module.error.apply(console, arguments);
    },
    performance: {
      log: function(message) {
        var
          currentTime,
          executionTime,
          previousTime
        ;
        if(settings.performance) {
          currentTime   = new Date().getTime();
          previousTime  = time || currentTime;
          executionTime = currentTime - previousTime;
          time          = currentTime;
          performance.push({
            'Element'        : element,
            'Name'           : message[0],
            'Arguments'      : [].slice.call(message, 1) || '',
            'Execution Time' : executionTime
          });
        }
        clearTimeout(module.performance.timer);
        module.performance.timer = setTimeout(module.performance.display, 500);
      },
      display: function() {
        var
          title = settings.name + ':',
          totalTime = 0
        ;
        time = false;
        clearTimeout(module.performance.timer);
        $.each(performance, function(index, data) {
          totalTime += data['Execution Time'];
        });
        title += ' ' + totalTime + 'ms';
        if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
          console.groupCollapsed(title);
          if(console.table) {
            console.table(performance);
          }
          else {
            $.each(performance, function(index, data) {
              console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
            });
          }
          console.groupEnd();
        }
        performance = [];
      }
    },
    invoke: function(query, passedArguments, context) {
      var
        object = instance,
        maxDepth,
        found,
        response
      ;
      passedArguments = passedArguments || queryArguments;
      context         = element         || context;
      if(typeof query == 'string' && object !== undefined) {
        query    = query.split(/[\. ]/);
        maxDepth = query.length - 1;
        $.each(query, function(depth, value) {
          var camelCaseValue = (depth != maxDepth)
            ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
            : query
          ;
          if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
            object = object[camelCaseValue];
          }
          else if( object[camelCaseValue] !== undefined ) {
            found = object[camelCaseValue];
            return false;
          }
          else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
            object = object[value];
          }
          else if( object[value] !== undefined ) {
            found = object[value];
            return false;
          }
          else {
            module.error(error.method, query);
            return false;
          }
        });
      }
      if ( $.isFunction( found ) ) {
        response = found.apply(context, passedArguments);
      }
      else if(found !== undefined) {
        response = found;
      }
      if(Array.isArray(returnedValue)) {
        returnedValue.push(response);
      }
      else if(returnedValue !== undefined) {
        returnedValue = [returnedValue, response];
      }
      else if(response !== undefined) {
        returnedValue = response;
      }
      return found;
    }
  };

  if(methodInvoked) {
    if(instance === undefined) {
      module.initialize();
    }
    module.invoke(query);
  }
  else {
    if(instance !== undefined) {
      module.destroy();
    }
    module.initialize();
  }
  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.site.settings = {

  name        : 'Site',
  namespace   : 'site',

  error : {
    console : 'Console cannot be restored, most likely it was overwritten outside of module',
    method : 'The method you called is not defined.'
  },

  debug       : false,
  verbose     : false,
  performance : true,

  modules: [
    'accordion',
    'api',
    'calendar',
    'checkbox',
    'dimmer',
    'dropdown',
    'embed',
    'form',
    'modal',
    'nag',
    'popup',
    'slider',
    'rating',
    'shape',
    'sidebar',
    'state',
    'sticky',
    'tab',
    'toast',
    'transition',
    'visibility',
    'visit'
  ],

  siteNamespace   : 'site',
  namespaceStub   : {
    cache     : {},
    config    : {},
    sections  : {},
    section   : {},
    utilities : {}
  }

};

// allows for selection of elements with data attributes
$.extend($.expr[ ":" ], {
  data: ($.expr.createPseudo)
    ? $.expr.createPseudo(function(dataName) {
        return function(elem) {
          return !!$.data(elem, dataName);
        };
      })
    : function(elem, i, match) {
      // support: jQuery < 1.8
      return !!$.data(elem, match[ 3 ]);
    }
});


})( jQuery, window, document );

/*!
 * # Fomantic-UI - Dropdown
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

'use strict';

$.isFunction = $.isFunction || function(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
};

window = (typeof window != 'undefined' && window.Math == Math)
  ? window
  : (typeof self != 'undefined' && self.Math == Math)
    ? self
    : Function('return this')()
;

$.fn.dropdown = function(parameters) {
  var
    $allModules    = $(this),
    $document      = $(document),

    moduleSelector = $allModules.selector || '',

    hasTouch       = ('ontouchstart' in document.documentElement),
    clickEvent      = hasTouch
        ? 'touchstart'
        : 'click',

    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),
    returnedValue
  ;

  $allModules
    .each(function(elementIndex) {
      var
        settings          = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.dropdown.settings, parameters)
          : $.extend({}, $.fn.dropdown.settings),

        className       = settings.className,
        message         = settings.message,
        fields          = settings.fields,
        keys            = settings.keys,
        metadata        = settings.metadata,
        namespace       = settings.namespace,
        regExp          = settings.regExp,
        selector        = settings.selector,
        error           = settings.error,
        templates       = settings.templates,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        $module         = $(this),
        $context        = $(settings.context),
        $text           = $module.find(selector.text),
        $search         = $module.find(selector.search),
        $sizer          = $module.find(selector.sizer),
        $input          = $module.find(selector.input),
        $icon           = $module.find(selector.icon),
        $clear          = $module.find(selector.clearIcon),

        $combo = ($module.prev().find(selector.text).length > 0)
          ? $module.prev().find(selector.text)
          : $module.prev(),

        $menu           = $module.children(selector.menu),
        $item           = $menu.find(selector.item),
        $divider        = settings.hideDividers ? $item.parent().children(selector.divider) : $(),

        activated       = false,
        itemActivated   = false,
        internalChange  = false,
        iconClicked     = false,
        element         = this,
        instance        = $module.data(moduleNamespace),

        selectActionActive,
        initialLoad,
        pageLostFocus,
        willRefocus,
        elementNamespace,
        id,
        selectObserver,
        menuObserver,
        module
      ;

      module = {

        initialize: function() {
          module.debug('Initializing dropdown', settings);

          if( module.is.alreadySetup() ) {
            module.setup.reference();
          }
          else {
            if (settings.ignoreDiacritics && !String.prototype.normalize) {
              settings.ignoreDiacritics = false;
              module.error(error.noNormalize, element);
            }

            module.setup.layout();

            if(settings.values) {
              module.set.initialLoad();
              module.change.values(settings.values);
              module.remove.initialLoad();
            }

            module.refreshData();

            module.save.defaults();
            module.restore.selected();

            module.create.id();
            module.bind.events();

            module.observeChanges();
            module.instantiate();
          }

        },

        instantiate: function() {
          module.verbose('Storing instance of dropdown', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous dropdown', $module);
          module.remove.tabbable();
          module.remove.active();
          $menu.transition('stop all');
          $menu.removeClass(className.visible).addClass(className.hidden);
          $module
            .off(eventNamespace)
            .removeData(moduleNamespace)
          ;
          $menu
            .off(eventNamespace)
          ;
          $document
            .off(elementNamespace)
          ;
          module.disconnect.menuObserver();
          module.disconnect.selectObserver();
        },

        observeChanges: function() {
          if('MutationObserver' in window) {
            selectObserver = new MutationObserver(module.event.select.mutation);
            menuObserver   = new MutationObserver(module.event.menu.mutation);
            module.debug('Setting up mutation observer', selectObserver, menuObserver);
            module.observe.select();
            module.observe.menu();
          }
        },

        disconnect: {
          menuObserver: function() {
            if(menuObserver) {
              menuObserver.disconnect();
            }
          },
          selectObserver: function() {
            if(selectObserver) {
              selectObserver.disconnect();
            }
          }
        },
        observe: {
          select: function() {
            if(module.has.input() && selectObserver) {
              selectObserver.observe($module[0], {
                childList : true,
                subtree   : true
              });
            }
          },
          menu: function() {
            if(module.has.menu() && menuObserver) {
              menuObserver.observe($menu[0], {
                childList : true,
                subtree   : true
              });
            }
          }
        },

        create: {
          id: function() {
            id = (Math.random().toString(16) + '000000000').substr(2, 8);
            elementNamespace = '.' + id;
            module.verbose('Creating unique id for element', id);
          },
          userChoice: function(values) {
            var
              $userChoices,
              $userChoice,
              isUserValue,
              html
            ;
            values = values || module.get.userValues();
            if(!values) {
              return false;
            }
            values = Array.isArray(values)
              ? values
              : [values]
            ;
            $.each(values, function(index, value) {
              if(module.get.item(value) === false) {
                html         = settings.templates.addition( module.add.variables(message.addResult, value) );
                $userChoice  = $('<div />')
                  .html(html)
                  .attr('data-' + metadata.value, value)
                  .attr('data-' + metadata.text, value)
                  .addClass(className.addition)
                  .addClass(className.item)
                ;
                if(settings.hideAdditions) {
                  $userChoice.addClass(className.hidden);
                }
                $userChoices = ($userChoices === undefined)
                  ? $userChoice
                  : $userChoices.add($userChoice)
                ;
                module.verbose('Creating user choices for value', value, $userChoice);
              }
            });
            return $userChoices;
          },
          userLabels: function(value) {
            var
              userValues = module.get.userValues()
            ;
            if(userValues) {
              module.debug('Adding user labels', userValues);
              $.each(userValues, function(index, value) {
                module.verbose('Adding custom user value');
                module.add.label(value, value);
              });
            }
          },
          menu: function() {
            $menu = $('<div />')
              .addClass(className.menu)
              .appendTo($module)
            ;
          },
          sizer: function() {
            $sizer = $('<span />')
              .addClass(className.sizer)
              .insertAfter($search)
            ;
          }
        },

        search: function(query) {
          query = (query !== undefined)
            ? query
            : module.get.query()
          ;
          module.verbose('Searching for query', query);
          if(module.has.minCharacters(query)) {
            module.filter(query);
          }
          else {
            module.hide(null,true);
          }
        },

        select: {
          firstUnfiltered: function() {
            module.verbose('Selecting first non-filtered element');
            module.remove.selectedItem();
            $item
              .not(selector.unselectable)
              .not(selector.addition + selector.hidden)
                .eq(0)
                .addClass(className.selected)
            ;
          },
          nextAvailable: function($selected) {
            $selected = $selected.eq(0);
            var
              $nextAvailable = $selected.nextAll(selector.item).not(selector.unselectable).eq(0),
              $prevAvailable = $selected.prevAll(selector.item).not(selector.unselectable).eq(0),
              hasNext        = ($nextAvailable.length > 0)
            ;
            if(hasNext) {
              module.verbose('Moving selection to', $nextAvailable);
              $nextAvailable.addClass(className.selected);
            }
            else {
              module.verbose('Moving selection to', $prevAvailable);
              $prevAvailable.addClass(className.selected);
            }
          }
        },

        setup: {
          api: function() {
            var
              apiSettings = {
                debug   : settings.debug,
                urlData : {
                  value : module.get.value(),
                  query : module.get.query()
                },
                on    : false
              }
            ;
            module.verbose('First request, initializing API');
            $module
              .api(apiSettings)
            ;
          },
          layout: function() {
            if( $module.is('select') ) {
              module.setup.select();
              module.setup.returnedObject();
            }
            if( !module.has.menu() ) {
              module.create.menu();
            }
            if ( module.is.selection() && module.is.clearable() && !module.has.clearItem() ) {
              module.verbose('Adding clear icon');
              $clear = $('<i />')
                .addClass('remove icon')
                .insertBefore($text)
              ;
            }
            if( module.is.search() && !module.has.search() ) {
              module.verbose('Adding search input');
              $search = $('<input />')
                .addClass(className.search)
                .prop('autocomplete', 'off')
                .insertBefore($text)
              ;
            }
            if( module.is.multiple() && module.is.searchSelection() && !module.has.sizer()) {
              module.create.sizer();
            }
            if(settings.allowTab) {
              module.set.tabbable();
            }
          },
          select: function() {
            var
              selectValues  = module.get.selectValues()
            ;
            module.debug('Dropdown initialized on a select', selectValues);
            if( $module.is('select') ) {
              $input = $module;
            }
            // see if select is placed correctly already
            if($input.parent(selector.dropdown).length > 0) {
              module.debug('UI dropdown already exists. Creating dropdown menu only');
              $module = $input.closest(selector.dropdown);
              if( !module.has.menu() ) {
                module.create.menu();
              }
              $menu = $module.children(selector.menu);
              module.setup.menu(selectValues);
            }
            else {
              module.debug('Creating entire dropdown from select');
              $module = $('<div />')
                .attr('class', $input.attr('class') )
                .addClass(className.selection)
                .addClass(className.dropdown)
                .html( templates.dropdown(selectValues, fields, settings.preserveHTML, settings.className) )
                .insertBefore($input)
              ;
              if($input.hasClass(className.multiple) && $input.prop('multiple') === false) {
                module.error(error.missingMultiple);
                $input.prop('multiple', true);
              }
              if($input.is('[multiple]')) {
                module.set.multiple();
              }
              if ($input.prop('disabled')) {
                module.debug('Disabling dropdown');
                $module.addClass(className.disabled);
              }
              $input
                .removeAttr('required')
                .removeAttr('class')
                .detach()
                .prependTo($module)
              ;
            }
            module.refresh();
          },
          menu: function(values) {
            $menu.html( templates.menu(values, fields,settings.preserveHTML,settings.className));
            $item    = $menu.find(selector.item);
            $divider = settings.hideDividers ? $item.parent().children(selector.divider) : $();
          },
          reference: function() {
            module.debug('Dropdown behavior was called on select, replacing with closest dropdown');
            // replace module reference
            $module  = $module.parent(selector.dropdown);
            instance = $module.data(moduleNamespace);
            element  = $module.get(0);
            module.refresh();
            module.setup.returnedObject();
          },
          returnedObject: function() {
            var
              $firstModules = $allModules.slice(0, elementIndex),
              $lastModules  = $allModules.slice(elementIndex + 1)
            ;
            // adjust all modules to use correct reference
            $allModules = $firstModules.add($module).add($lastModules);
          }
        },

        refresh: function() {
          module.refreshSelectors();
          module.refreshData();
        },

        refreshItems: function() {
          $item    = $menu.find(selector.item);
          $divider = settings.hideDividers ? $item.parent().children(selector.divider) : $();
        },

        refreshSelectors: function() {
          module.verbose('Refreshing selector cache');
          $text   = $module.find(selector.text);
          $search = $module.find(selector.search);
          $input  = $module.find(selector.input);
          $icon   = $module.find(selector.icon);
          $combo  = ($module.prev().find(selector.text).length > 0)
            ? $module.prev().find(selector.text)
            : $module.prev()
          ;
          $menu    = $module.children(selector.menu);
          $item    = $menu.find(selector.item);
          $divider = settings.hideDividers ? $item.parent().children(selector.divider) : $();
        },

        refreshData: function() {
          module.verbose('Refreshing cached metadata');
          $item
            .removeData(metadata.text)
            .removeData(metadata.value)
          ;
        },

        clearData: function() {
          module.verbose('Clearing metadata');
          $item
            .removeData(metadata.text)
            .removeData(metadata.value)
          ;
          $module
            .removeData(metadata.defaultText)
            .removeData(metadata.defaultValue)
            .removeData(metadata.placeholderText)
          ;
        },

        toggle: function() {
          module.verbose('Toggling menu visibility');
          if( !module.is.active() ) {
            module.show();
          }
          else {
            module.hide();
          }
        },

        show: function(callback, preventFocus) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if(!module.can.show() && module.is.remote()) {
            module.debug('No API results retrieved, searching before show');
            module.queryRemote(module.get.query(), module.show);
          }
          if( module.can.show() && !module.is.active() ) {
            module.debug('Showing dropdown');
            if(module.has.message() && !(module.has.maxSelections() || module.has.allResultsFiltered()) ) {
              module.remove.message();
            }
            if(module.is.allFiltered()) {
              return true;
            }
            if(settings.onShow.call(element) !== false) {
              module.animate.show(function() {
                if( module.can.click() ) {
                  module.bind.intent();
                }
                if(module.has.search() && !preventFocus) {
                  module.focusSearch();
                }
                module.set.visible();
                callback.call(element);
              });
            }
          }
        },

        hide: function(callback, preventBlur) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( module.is.active() && !module.is.animatingOutward() ) {
            module.debug('Hiding dropdown');
            if(settings.onHide.call(element) !== false) {
              module.animate.hide(function() {
                module.remove.visible();
                // hidding search focus
                if ( module.is.focusedOnSearch() && preventBlur !== true ) {
                  $search.blur();
                }
                callback.call(element);
              });
            }
          } else if( module.can.click() ) {
              module.unbind.intent();
          }
          iconClicked = false;
        },

        hideOthers: function() {
          module.verbose('Finding other dropdowns to hide');
          $allModules
            .not($module)
              .has(selector.menu + '.' + className.visible)
                .dropdown('hide')
          ;
        },

        hideMenu: function() {
          module.verbose('Hiding menu  instantaneously');
          module.remove.active();
          module.remove.visible();
          $menu.transition('hide');
        },

        hideSubMenus: function() {
          var
            $subMenus = $menu.children(selector.item).find(selector.menu)
          ;
          module.verbose('Hiding sub menus', $subMenus);
          $subMenus.transition('hide');
        },

        bind: {
          events: function() {
            module.bind.keyboardEvents();
            module.bind.inputEvents();
            module.bind.mouseEvents();
          },
          keyboardEvents: function() {
            module.verbose('Binding keyboard events');
            $module
              .on('keydown' + eventNamespace, module.event.keydown)
            ;
            if( module.has.search() ) {
              $module
                .on(module.get.inputEvent() + eventNamespace, selector.search, module.event.input)
              ;
            }
            if( module.is.multiple() ) {
              $document
                .on('keydown' + elementNamespace, module.event.document.keydown)
              ;
            }
          },
          inputEvents: function() {
            module.verbose('Binding input change events');
            $module
              .on('change' + eventNamespace, selector.input, module.event.change)
            ;
          },
          mouseEvents: function() {
            module.verbose('Binding mouse events');
            if(module.is.multiple()) {
              $module
                .on(clickEvent   + eventNamespace, selector.label,  module.event.label.click)
                .on(clickEvent   + eventNamespace, selector.remove, module.event.remove.click)
              ;
            }
            if( module.is.searchSelection() ) {
              $module
                .on('mousedown' + eventNamespace, module.event.mousedown)
                .on('mouseup'   + eventNamespace, module.event.mouseup)
                .on('mousedown' + eventNamespace, selector.menu,   module.event.menu.mousedown)
                .on('mouseup'   + eventNamespace, selector.menu,   module.event.menu.mouseup)
                .on(clickEvent  + eventNamespace, selector.icon,   module.event.icon.click)
                .on(clickEvent  + eventNamespace, selector.clearIcon, module.event.clearIcon.click)
                .on('focus'     + eventNamespace, selector.search, module.event.search.focus)
                .on(clickEvent  + eventNamespace, selector.search, module.event.search.focus)
                .on('blur'      + eventNamespace, selector.search, module.event.search.blur)
                .on(clickEvent  + eventNamespace, selector.text,   module.event.text.focus)
              ;
              if(module.is.multiple()) {
                $module
                  .on(clickEvent + eventNamespace, module.event.click)
                ;
              }
            }
            else {
              if(settings.on == 'click') {
                $module
                  .on(clickEvent + eventNamespace, selector.icon, module.event.icon.click)
                  .on(clickEvent + eventNamespace, module.event.test.toggle)
                ;
              }
              else if(settings.on == 'hover') {
                $module
                  .on('mouseenter' + eventNamespace, module.delay.show)
                  .on('mouseleave' + eventNamespace, module.delay.hide)
                ;
              }
              else {
                $module
                  .on(settings.on + eventNamespace, module.toggle)
                ;
              }
              $module
                .on('mousedown' + eventNamespace, module.event.mousedown)
                .on('mouseup'   + eventNamespace, module.event.mouseup)
                .on('focus'     + eventNamespace, module.event.focus)
                .on(clickEvent  + eventNamespace, selector.clearIcon, module.event.clearIcon.click)
              ;
              if(module.has.menuSearch() ) {
                $module
                  .on('blur' + eventNamespace, selector.search, module.event.search.blur)
                ;
              }
              else {
                $module
                  .on('blur' + eventNamespace, module.event.blur)
                ;
              }
            }
            $menu
              .on((hasTouch ? 'touchstart' : 'mouseenter') + eventNamespace, selector.item, module.event.item.mouseenter)
              .on('mouseleave' + eventNamespace, selector.item, module.event.item.mouseleave)
              .on('click'      + eventNamespace, selector.item, module.event.item.click)
            ;
          },
          intent: function() {
            module.verbose('Binding hide intent event to document');
            if(hasTouch) {
              $document
                .on('touchstart' + elementNamespace, module.event.test.touch)
                .on('touchmove'  + elementNamespace, module.event.test.touch)
              ;
            }
            $document
              .on(clickEvent + elementNamespace, module.event.test.hide)
            ;
          }
        },

        unbind: {
          intent: function() {
            module.verbose('Removing hide intent event from document');
            if(hasTouch) {
              $document
                .off('touchstart' + elementNamespace)
                .off('touchmove' + elementNamespace)
              ;
            }
            $document
              .off(clickEvent + elementNamespace)
            ;
          }
        },

        filter: function(query) {
          var
            searchTerm = (query !== undefined)
              ? query
              : module.get.query(),
            afterFiltered = function() {
              if(module.is.multiple()) {
                module.filterActive();
              }
              if(query || (!query && module.get.activeItem().length == 0)) {
                module.select.firstUnfiltered();
              }
              if( module.has.allResultsFiltered() ) {
                if( settings.onNoResults.call(element, searchTerm) ) {
                  if(settings.allowAdditions) {
                    if(settings.hideAdditions) {
                      module.verbose('User addition with no menu, setting empty style');
                      module.set.empty();
                      module.hideMenu();
                    }
                  }
                  else {
                    module.verbose('All items filtered, showing message', searchTerm);
                    module.add.message(message.noResults);
                  }
                }
                else {
                  module.verbose('All items filtered, hiding dropdown', searchTerm);
                  module.hideMenu();
                }
              }
              else {
                module.remove.empty();
                module.remove.message();
              }
              if(settings.allowAdditions) {
                module.add.userSuggestion(module.escape.htmlEntities(query));
              }
              if(module.is.searchSelection() && module.can.show() && module.is.focusedOnSearch() ) {
                module.show();
              }
            }
          ;
          if(settings.useLabels && module.has.maxSelections()) {
            return;
          }
          if(settings.apiSettings) {
            if( module.can.useAPI() ) {
              module.queryRemote(searchTerm, function() {
                if(settings.filterRemoteData) {
                  module.filterItems(searchTerm);
                }
                var preSelected = $input.val();
                if(!Array.isArray(preSelected)) {
                    preSelected = preSelected && preSelected!=="" ? preSelected.split(settings.delimiter) : [];
                }
                $.each(preSelected,function(index,value){
                  $item.filter('[data-value="'+value+'"]')
                      .addClass(className.filtered)
                  ;
                });
                afterFiltered();
              });
            }
            else {
              module.error(error.noAPI);
            }
          }
          else {
            module.filterItems(searchTerm);
            afterFiltered();
          }
        },

        queryRemote: function(query, callback) {
          var
            apiSettings = {
              errorDuration : false,
              cache         : 'local',
              throttle      : settings.throttle,
              urlData       : {
                query: query
              },
              onError: function() {
                module.add.message(message.serverError);
                callback();
              },
              onFailure: function() {
                module.add.message(message.serverError);
                callback();
              },
              onSuccess : function(response) {
                var
                  values          = response[fields.remoteValues]
                ;
                if (!Array.isArray(values)){
                    values = [];
                }
                module.remove.message();
                module.setup.menu({
                  values: values
                });

                if(values.length===0 && !settings.allowAdditions) {
                  module.add.message(message.noResults);
                }
                callback();
              }
            }
          ;
          if( !$module.api('get request') ) {
            module.setup.api();
          }
          apiSettings = $.extend(true, {}, apiSettings, settings.apiSettings);
          $module
            .api('setting', apiSettings)
            .api('query')
          ;
        },

        filterItems: function(query) {
          var
            searchTerm = module.remove.diacritics(query !== undefined
              ? query
              : module.get.query()
            ),
            results          =  null,
            escapedTerm      = module.escape.string(searchTerm),
            regExpFlags      = (settings.ignoreSearchCase ? 'i' : '') + 'gm',
            beginsWithRegExp = new RegExp('^' + escapedTerm, regExpFlags)
          ;
          // avoid loop if we're matching nothing
          if( module.has.query() ) {
            results = [];

            module.verbose('Searching for matching values', searchTerm);
            $item
              .each(function(){
                var
                  $choice = $(this),
                  text,
                  value
                ;
                if($choice.hasClass(className.unfilterable)) {
                  results.push(this);
                  return true;
                }
                if(settings.match === 'both' || settings.match === 'text') {
                  text = module.remove.diacritics(String(module.get.choiceText($choice, false)));
                  if(text.search(beginsWithRegExp) !== -1) {
                    results.push(this);
                    return true;
                  }
                  else if (settings.fullTextSearch === 'exact' && module.exactSearch(searchTerm, text)) {
                    results.push(this);
                    return true;
                  }
                  else if (settings.fullTextSearch === true && module.fuzzySearch(searchTerm, text)) {
                    results.push(this);
                    return true;
                  }
                }
                if(settings.match === 'both' || settings.match === 'value') {
                  value = module.remove.diacritics(String(module.get.choiceValue($choice, text)));
                  if(value.search(beginsWithRegExp) !== -1) {
                    results.push(this);
                    return true;
                  }
                  else if (settings.fullTextSearch === 'exact' && module.exactSearch(searchTerm, value)) {
                    results.push(this);
                    return true;
                  }
                  else if (settings.fullTextSearch === true && module.fuzzySearch(searchTerm, value)) {
                    results.push(this);
                    return true;
                  }
                }
              })
            ;
          }
          module.debug('Showing only matched items', searchTerm);
          module.remove.filteredItem();
          if(results) {
            $item
              .not(results)
              .addClass(className.filtered)
            ;
          }

          if(!module.has.query()) {
            $divider
              .removeClass(className.hidden);
          } else if(settings.hideDividers === true) {
            $divider
              .addClass(className.hidden);
          } else if(settings.hideDividers === 'empty') {
            $divider
              .removeClass(className.hidden)
              .filter(function() {
                // First find the last divider in this divider group
                // Dividers which are direct siblings are considered a group
                var lastDivider = $(this).nextUntil(selector.item);

                return (lastDivider.length ? lastDivider : $(this))
                // Count all non-filtered items until the next divider (or end of the dropdown)
                  .nextUntil(selector.divider)
                  .filter(selector.item + ":not(." + className.filtered + ")")
                  // Hide divider if no items are found
                  .length === 0;
              })
              .addClass(className.hidden);
          }
        },

        fuzzySearch: function(query, term) {
          var
            termLength  = term.length,
            queryLength = query.length
          ;
          query = (settings.ignoreSearchCase ? query.toLowerCase() : query);
          term  = (settings.ignoreSearchCase ? term.toLowerCase() : term);
          if(queryLength > termLength) {
            return false;
          }
          if(queryLength === termLength) {
            return (query === term);
          }
          search: for (var characterIndex = 0, nextCharacterIndex = 0; characterIndex < queryLength; characterIndex++) {
            var
              queryCharacter = query.charCodeAt(characterIndex)
            ;
            while(nextCharacterIndex < termLength) {
              if(term.charCodeAt(nextCharacterIndex++) === queryCharacter) {
                continue search;
              }
            }
            return false;
          }
          return true;
        },
        exactSearch: function (query, term) {
          query = (settings.ignoreSearchCase ? query.toLowerCase() : query);
          term  = (settings.ignoreSearchCase ? term.toLowerCase() : term);
          return term.indexOf(query) > -1;

        },
        filterActive: function() {
          if(settings.useLabels) {
            $item.filter('.' + className.active)
              .addClass(className.filtered)
            ;
          }
        },

        focusSearch: function(skipHandler) {
          if( module.has.search() && !module.is.focusedOnSearch() ) {
            if(skipHandler) {
              $module.off('focus' + eventNamespace, selector.search);
              $search.focus();
              $module.on('focus'  + eventNamespace, selector.search, module.event.search.focus);
            }
            else {
              $search.focus();
            }
          }
        },

        blurSearch: function() {
          if( module.has.search() ) {
            $search.blur();
          }
        },

        forceSelection: function() {
          var
            $currentlySelected = $item.not(className.filtered).filter('.' + className.selected).eq(0),
            $activeItem        = $item.not(className.filtered).filter('.' + className.active).eq(0),
            $selectedItem      = ($currentlySelected.length > 0)
              ? $currentlySelected
              : $activeItem,
            hasSelected = ($selectedItem.length > 0)
          ;
          if(settings.allowAdditions || (hasSelected && !module.is.multiple())) {
            module.debug('Forcing partial selection to selected item', $selectedItem);
            module.event.item.click.call($selectedItem, {}, true);
          }
          else {
            module.remove.searchTerm();
          }
        },

        change: {
          values: function(values) {
            if(!settings.allowAdditions) {
              module.clear();
            }
            module.debug('Creating dropdown with specified values', values);
            module.setup.menu({values: values});
            $.each(values, function(index, item) {
              if(item.selected == true) {
                module.debug('Setting initial selection to', item[fields.value]);
                module.set.selected(item[fields.value]);
                if(!module.is.multiple()) {
                  return false;
                }
              }
            });

            if(module.has.selectInput()) {
              module.disconnect.selectObserver();
              $input.html('');
              $input.append('<option disabled selected value></option>');
              $.each(values, function(index, item) {
                var
                  value = settings.templates.deQuote(item[fields.value]),
                  name = settings.templates.escape(
                    item[fields.name] || '',
                    settings.preserveHTML
                  )
                ;
                $input.append('<option value="' + value + '">' + name + '</option>');
              });
              module.observe.select();
            }
          }
        },

        event: {
          change: function() {
            if(!internalChange) {
              module.debug('Input changed, updating selection');
              module.set.selected();
            }
          },
          focus: function() {
            if(settings.showOnFocus && !activated && module.is.hidden() && !pageLostFocus) {
              module.show();
            }
          },
          blur: function(event) {
            pageLostFocus = (document.activeElement === this);
            if(!activated && !pageLostFocus) {
              module.remove.activeLabel();
              module.hide();
            }
          },
          mousedown: function() {
            if(module.is.searchSelection()) {
              // prevent menu hiding on immediate re-focus
              willRefocus = true;
            }
            else {
              // prevents focus callback from occurring on mousedown
              activated = true;
            }
          },
          mouseup: function() {
            if(module.is.searchSelection()) {
              // prevent menu hiding on immediate re-focus
              willRefocus = false;
            }
            else {
              activated = false;
            }
          },
          click: function(event) {
            var
              $target = $(event.target)
            ;
            // focus search
            if($target.is($module)) {
              if(!module.is.focusedOnSearch()) {
                module.focusSearch();
              }
              else {
                module.show();
              }
            }
          },
          search: {
            focus: function(event) {
              activated = true;
              if(module.is.multiple()) {
                module.remove.activeLabel();
              }
              if(settings.showOnFocus || (event.type !== 'focus' && event.type !== 'focusin')) {
                module.search();
              }
            },
            blur: function(event) {
              pageLostFocus = (document.activeElement === this);
              if(module.is.searchSelection() && !willRefocus) {
                if(!itemActivated && !pageLostFocus) {
                  if(settings.forceSelection) {
                    module.forceSelection();
                  } else if(!settings.allowAdditions){
                    module.remove.searchTerm();
                  }
                  module.hide();
                }
              }
              willRefocus = false;
            }
          },
          clearIcon: {
            click: function(event) {
              module.clear();
              if(module.is.searchSelection()) {
                module.remove.searchTerm();
              }
              module.hide();
              event.stopPropagation();
            }
          },
          icon: {
            click: function(event) {
              iconClicked=true;
              if(module.has.search()) {
                if(!module.is.active()) {
                    if(settings.showOnFocus){
                      module.focusSearch();
                    } else {
                      module.toggle();
                    }
                } else {
                  module.blurSearch();
                }
              } else {
                module.toggle();
              }
            }
          },
          text: {
            focus: function(event) {
              activated = true;
              module.focusSearch();
            }
          },
          input: function(event) {
            if(module.is.multiple() || module.is.searchSelection()) {
              module.set.filtered();
            }
            clearTimeout(module.timer);
            module.timer = setTimeout(module.search, settings.delay.search);
          },
          label: {
            click: function(event) {
              var
                $label        = $(this),
                $labels       = $module.find(selector.label),
                $activeLabels = $labels.filter('.' + className.active),
                $nextActive   = $label.nextAll('.' + className.active),
                $prevActive   = $label.prevAll('.' + className.active),
                $range = ($nextActive.length > 0)
                  ? $label.nextUntil($nextActive).add($activeLabels).add($label)
                  : $label.prevUntil($prevActive).add($activeLabels).add($label)
              ;
              if(event.shiftKey) {
                $activeLabels.removeClass(className.active);
                $range.addClass(className.active);
              }
              else if(event.ctrlKey) {
                $label.toggleClass(className.active);
              }
              else {
                $activeLabels.removeClass(className.active);
                $label.addClass(className.active);
              }
              settings.onLabelSelect.apply(this, $labels.filter('.' + className.active));
            }
          },
          remove: {
            click: function() {
              var
                $label = $(this).parent()
              ;
              if( $label.hasClass(className.active) ) {
                // remove all selected labels
                module.remove.activeLabels();
              }
              else {
                // remove this label only
                module.remove.activeLabels( $label );
              }
            }
          },
          test: {
            toggle: function(event) {
              var
                toggleBehavior = (module.is.multiple())
                  ? module.show
                  : module.toggle
              ;
              if(module.is.bubbledLabelClick(event) || module.is.bubbledIconClick(event)) {
                return;
              }
              if( module.determine.eventOnElement(event, toggleBehavior) ) {
                event.preventDefault();
              }
            },
            touch: function(event) {
              module.determine.eventOnElement(event, function() {
                if(event.type == 'touchstart') {
                  module.timer = setTimeout(function() {
                    module.hide();
                  }, settings.delay.touch);
                }
                else if(event.type == 'touchmove') {
                  clearTimeout(module.timer);
                }
              });
              event.stopPropagation();
            },
            hide: function(event) {
              if(module.determine.eventInModule(event, module.hide)){
                if(element.id && $(event.target).attr('for') === element.id){
                  event.preventDefault();
                }
              }
            }
          },
          select: {
            mutation: function(mutations) {
              module.debug('<select> modified, recreating menu');
              if(module.is.selectMutation(mutations)) {
                module.disconnect.selectObserver();
                module.refresh();
                module.setup.select();
                module.set.selected();
                module.observe.select();
              }
            }
          },
          menu: {
            mutation: function(mutations) {
              var
                mutation   = mutations[0],
                $addedNode = mutation.addedNodes
                  ? $(mutation.addedNodes[0])
                  : $(false),
                $removedNode = mutation.removedNodes
                  ? $(mutation.removedNodes[0])
                  : $(false),
                $changedNodes  = $addedNode.add($removedNode),
                isUserAddition = $changedNodes.is(selector.addition) || $changedNodes.closest(selector.addition).length > 0,
                isMessage      = $changedNodes.is(selector.message)  || $changedNodes.closest(selector.message).length > 0
              ;
              if(isUserAddition || isMessage) {
                module.debug('Updating item selector cache');
                module.refreshItems();
              }
              else {
                module.debug('Menu modified, updating selector cache');
                module.refresh();
              }
            },
            mousedown: function() {
              itemActivated = true;
            },
            mouseup: function() {
              itemActivated = false;
            }
          },
          item: {
            mouseenter: function(event) {
              var
                $target        = $(event.target),
                $item          = $(this),
                $subMenu       = $item.children(selector.menu),
                $otherMenus    = $item.siblings(selector.item).children(selector.menu),
                hasSubMenu     = ($subMenu.length > 0),
                isBubbledEvent = ($subMenu.find($target).length > 0)
              ;
              if( !isBubbledEvent && hasSubMenu ) {
                clearTimeout(module.itemTimer);
                module.itemTimer = setTimeout(function() {
                  module.verbose('Showing sub-menu', $subMenu);
                  $.each($otherMenus, function() {
                    module.animate.hide(false, $(this));
                  });
                  module.animate.show(false, $subMenu);
                }, settings.delay.show);
                event.preventDefault();
              }
            },
            mouseleave: function(event) {
              var
                $subMenu = $(this).children(selector.menu)
              ;
              if($subMenu.length > 0) {
                clearTimeout(module.itemTimer);
                module.itemTimer = setTimeout(function() {
                  module.verbose('Hiding sub-menu', $subMenu);
                  module.animate.hide(false, $subMenu);
                }, settings.delay.hide);
              }
            },
            click: function (event, skipRefocus) {
              var
                $choice        = $(this),
                $target        = (event)
                  ? $(event.target)
                  : $(''),
                $subMenu       = $choice.find(selector.menu),
                text           = module.get.choiceText($choice),
                value          = module.get.choiceValue($choice, text),
                hasSubMenu     = ($subMenu.length > 0),
                isBubbledEvent = ($subMenu.find($target).length > 0)
              ;
              // prevents IE11 bug where menu receives focus even though `tabindex=-1`
              if (document.activeElement.tagName.toLowerCase() !== 'input') {
                $(document.activeElement).blur();
              }
              if(!isBubbledEvent && (!hasSubMenu || settings.allowCategorySelection)) {
                if(module.is.searchSelection()) {
                  if(settings.allowAdditions) {
                    module.remove.userAddition();
                  }
                  module.remove.searchTerm();
                  if(!module.is.focusedOnSearch() && !(skipRefocus == true)) {
                    module.focusSearch(true);
                  }
                }
                if(!settings.useLabels) {
                  module.remove.filteredItem();
                  module.set.scrollPosition($choice);
                }
                module.determine.selectAction.call(this, text, value);
              }
            }
          },

          document: {
            // label selection should occur even when element has no focus
            keydown: function(event) {
              var
                pressedKey    = event.which,
                isShortcutKey = module.is.inObject(pressedKey, keys)
              ;
              if(isShortcutKey) {
                var
                  $label            = $module.find(selector.label),
                  $activeLabel      = $label.filter('.' + className.active),
                  activeValue       = $activeLabel.data(metadata.value),
                  labelIndex        = $label.index($activeLabel),
                  labelCount        = $label.length,
                  hasActiveLabel    = ($activeLabel.length > 0),
                  hasMultipleActive = ($activeLabel.length > 1),
                  isFirstLabel      = (labelIndex === 0),
                  isLastLabel       = (labelIndex + 1 == labelCount),
                  isSearch          = module.is.searchSelection(),
                  isFocusedOnSearch = module.is.focusedOnSearch(),
                  isFocused         = module.is.focused(),
                  caretAtStart      = (isFocusedOnSearch && module.get.caretPosition(false) === 0),
                  isSelectedSearch  = (caretAtStart && module.get.caretPosition(true) !== 0),
                  $nextLabel
                ;
                if(isSearch && !hasActiveLabel && !isFocusedOnSearch) {
                  return;
                }

                if(pressedKey == keys.leftArrow) {
                  // activate previous label
                  if((isFocused || caretAtStart) && !hasActiveLabel) {
                    module.verbose('Selecting previous label');
                    $label.last().addClass(className.active);
                  }
                  else if(hasActiveLabel) {
                    if(!event.shiftKey) {
                      module.verbose('Selecting previous label');
                      $label.removeClass(className.active);
                    }
                    else {
                      module.verbose('Adding previous label to selection');
                    }
                    if(isFirstLabel && !hasMultipleActive) {
                      $activeLabel.addClass(className.active);
                    }
                    else {
                      $activeLabel.prev(selector.siblingLabel)
                        .addClass(className.active)
                        .end()
                      ;
                    }
                    event.preventDefault();
                  }
                }
                else if(pressedKey == keys.rightArrow) {
                  // activate first label
                  if(isFocused && !hasActiveLabel) {
                    $label.first().addClass(className.active);
                  }
                  // activate next label
                  if(hasActiveLabel) {
                    if(!event.shiftKey) {
                      module.verbose('Selecting next label');
                      $label.removeClass(className.active);
                    }
                    else {
                      module.verbose('Adding next label to selection');
                    }
                    if(isLastLabel) {
                      if(isSearch) {
                        if(!isFocusedOnSearch) {
                          module.focusSearch();
                        }
                        else {
                          $label.removeClass(className.active);
                        }
                      }
                      else if(hasMultipleActive) {
                        $activeLabel.next(selector.siblingLabel).addClass(className.active);
                      }
                      else {
                        $activeLabel.addClass(className.active);
                      }
                    }
                    else {
                      $activeLabel.next(selector.siblingLabel).addClass(className.active);
                    }
                    event.preventDefault();
                  }
                }
                else if(pressedKey == keys.deleteKey || pressedKey == keys.backspace) {
                  if(hasActiveLabel) {
                    module.verbose('Removing active labels');
                    if(isLastLabel) {
                      if(isSearch && !isFocusedOnSearch) {
                        module.focusSearch();
                      }
                    }
                    $activeLabel.last().next(selector.siblingLabel).addClass(className.active);
                    module.remove.activeLabels($activeLabel);
                    event.preventDefault();
                  }
                  else if(caretAtStart && !isSelectedSearch && !hasActiveLabel && pressedKey == keys.backspace) {
                    module.verbose('Removing last label on input backspace');
                    $activeLabel = $label.last().addClass(className.active);
                    module.remove.activeLabels($activeLabel);
                  }
                }
                else {
                  $activeLabel.removeClass(className.active);
                }
              }
            }
          },

          keydown: function(event) {
            var
              pressedKey    = event.which,
              isShortcutKey = module.is.inObject(pressedKey, keys)
            ;
            if(isShortcutKey) {
              var
                $currentlySelected = $item.not(selector.unselectable).filter('.' + className.selected).eq(0),
                $activeItem        = $menu.children('.' + className.active).eq(0),
                $selectedItem      = ($currentlySelected.length > 0)
                  ? $currentlySelected
                  : $activeItem,
                $visibleItems = ($selectedItem.length > 0)
                  ? $selectedItem.siblings(':not(.' + className.filtered +')').addBack()
                  : $menu.children(':not(.' + className.filtered +')'),
                $subMenu              = $selectedItem.children(selector.menu),
                $parentMenu           = $selectedItem.closest(selector.menu),
                inVisibleMenu         = ($parentMenu.hasClass(className.visible) || $parentMenu.hasClass(className.animating) || $parentMenu.parent(selector.menu).length > 0),
                hasSubMenu            = ($subMenu.length> 0),
                hasSelectedItem       = ($selectedItem.length > 0),
                selectedIsSelectable  = ($selectedItem.not(selector.unselectable).length > 0),
                delimiterPressed      = (pressedKey == keys.delimiter && settings.allowAdditions && module.is.multiple()),
                isAdditionWithoutMenu = (settings.allowAdditions && settings.hideAdditions && (pressedKey == keys.enter || delimiterPressed) && selectedIsSelectable),
                $nextItem,
                isSubMenuItem,
                newIndex
              ;
              // allow selection with menu closed
              if(isAdditionWithoutMenu) {
                module.verbose('Selecting item from keyboard shortcut', $selectedItem);
                module.event.item.click.call($selectedItem, event);
                if(module.is.searchSelection()) {
                  module.remove.searchTerm();
                }
                if(module.is.multiple()){
                    event.preventDefault();
                }
              }

              // visible menu keyboard shortcuts
              if( module.is.visible() ) {

                // enter (select or open sub-menu)
                if(pressedKey == keys.enter || delimiterPressed) {
                  if(pressedKey == keys.enter && hasSelectedItem && hasSubMenu && !settings.allowCategorySelection) {
                    module.verbose('Pressed enter on unselectable category, opening sub menu');
                    pressedKey = keys.rightArrow;
                  }
                  else if(selectedIsSelectable) {
                    module.verbose('Selecting item from keyboard shortcut', $selectedItem);
                    module.event.item.click.call($selectedItem, event);
                    if(module.is.searchSelection()) {
                      module.remove.searchTerm();
                      if(module.is.multiple()) {
                          $search.focus();
                      }
                    }
                  }
                  event.preventDefault();
                }

                // sub-menu actions
                if(hasSelectedItem) {

                  if(pressedKey == keys.leftArrow) {

                    isSubMenuItem = ($parentMenu[0] !== $menu[0]);

                    if(isSubMenuItem) {
                      module.verbose('Left key pressed, closing sub-menu');
                      module.animate.hide(false, $parentMenu);
                      $selectedItem
                        .removeClass(className.selected)
                      ;
                      $parentMenu
                        .closest(selector.item)
                          .addClass(className.selected)
                      ;
                      event.preventDefault();
                    }
                  }

                  // right arrow (show sub-menu)
                  if(pressedKey == keys.rightArrow) {
                    if(hasSubMenu) {
                      module.verbose('Right key pressed, opening sub-menu');
                      module.animate.show(false, $subMenu);
                      $selectedItem
                        .removeClass(className.selected)
                      ;
                      $subMenu
                        .find(selector.item).eq(0)
                          .addClass(className.selected)
                      ;
                      event.preventDefault();
                    }
                  }
                }

                // up arrow (traverse menu up)
                if(pressedKey == keys.upArrow) {
                  $nextItem = (hasSelectedItem && inVisibleMenu)
                    ? $selectedItem.prevAll(selector.item + ':not(' + selector.unselectable + ')').eq(0)
                    : $item.eq(0)
                  ;
                  if($visibleItems.index( $nextItem ) < 0) {
                    module.verbose('Up key pressed but reached top of current menu');
                    event.preventDefault();
                    return;
                  }
                  else {
                    module.verbose('Up key pressed, changing active item');
                    $selectedItem
                      .removeClass(className.selected)
                    ;
                    $nextItem
                      .addClass(className.selected)
                    ;
                    module.set.scrollPosition($nextItem);
                    if(settings.selectOnKeydown && module.is.single()) {
                      module.set.selectedItem($nextItem);
                    }
                  }
                  event.preventDefault();
                }

                // down arrow (traverse menu down)
                if(pressedKey == keys.downArrow) {
                  $nextItem = (hasSelectedItem && inVisibleMenu)
                    ? $nextItem = $selectedItem.nextAll(selector.item + ':not(' + selector.unselectable + ')').eq(0)
                    : $item.eq(0)
                  ;
                  if($nextItem.length === 0) {
                    module.verbose('Down key pressed but reached bottom of current menu');
                    event.preventDefault();
                    return;
                  }
                  else {
                    module.verbose('Down key pressed, changing active item');
                    $item
                      .removeClass(className.selected)
                    ;
                    $nextItem
                      .addClass(className.selected)
                    ;
                    module.set.scrollPosition($nextItem);
                    if(settings.selectOnKeydown && module.is.single()) {
                      module.set.selectedItem($nextItem);
                    }
                  }
                  event.preventDefault();
                }

                // page down (show next page)
                if(pressedKey == keys.pageUp) {
                  module.scrollPage('up');
                  event.preventDefault();
                }
                if(pressedKey == keys.pageDown) {
                  module.scrollPage('down');
                  event.preventDefault();
                }

                // escape (close menu)
                if(pressedKey == keys.escape) {
                  module.verbose('Escape key pressed, closing dropdown');
                  module.hide();
                }

              }
              else {
                // delimiter key
                if(delimiterPressed) {
                  event.preventDefault();
                }
                // down arrow (open menu)
                if(pressedKey == keys.downArrow && !module.is.visible()) {
                  module.verbose('Down key pressed, showing dropdown');
                  module.show();
                  event.preventDefault();
                }
              }
            }
            else {
              if( !module.has.search() ) {
                module.set.selectedLetter( String.fromCharCode(pressedKey) );
              }
            }
          }
        },

        trigger: {
          change: function() {
            var
              events       = document.createEvent('HTMLEvents'),
              inputElement = $input[0]
            ;
            if(inputElement) {
              module.verbose('Triggering native change event');
              events.initEvent('change', true, false);
              inputElement.dispatchEvent(events);
            }
          }
        },

        determine: {
          selectAction: function(text, value) {
            selectActionActive = true;
            module.verbose('Determining action', settings.action);
            if( $.isFunction( module.action[settings.action] ) ) {
              module.verbose('Triggering preset action', settings.action, text, value);
              module.action[ settings.action ].call(element, text, value, this);
            }
            else if( $.isFunction(settings.action) ) {
              module.verbose('Triggering user action', settings.action, text, value);
              settings.action.call(element, text, value, this);
            }
            else {
              module.error(error.action, settings.action);
            }
            selectActionActive = false;
          },
          eventInModule: function(event, callback) {
            var
              $target    = $(event.target),
              inDocument = ($target.closest(document.documentElement).length > 0),
              inModule   = ($target.closest($module).length > 0)
            ;
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(inDocument && !inModule) {
              module.verbose('Triggering event', callback);
              callback();
              return true;
            }
            else {
              module.verbose('Event occurred in dropdown, canceling callback');
              return false;
            }
          },
          eventOnElement: function(event, callback) {
            var
              $target      = $(event.target),
              $label       = $target.closest(selector.siblingLabel),
              inVisibleDOM = document.body.contains(event.target),
              notOnLabel   = ($module.find($label).length === 0 || !(module.is.multiple() && settings.useLabels)),
              notInMenu    = ($target.closest($menu).length === 0)
            ;
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(inVisibleDOM && notOnLabel && notInMenu) {
              module.verbose('Triggering event', callback);
              callback();
              return true;
            }
            else {
              module.verbose('Event occurred in dropdown menu, canceling callback');
              return false;
            }
          }
        },

        action: {

          nothing: function() {},

          activate: function(text, value, element) {
            value = (value !== undefined)
              ? value
              : text
            ;
            if( module.can.activate( $(element) ) ) {
              module.set.selected(value, $(element));
              if(!module.is.multiple()) {
                module.hideAndClear();
              }
            }
          },

          select: function(text, value, element) {
            value = (value !== undefined)
              ? value
              : text
            ;
            if( module.can.activate( $(element) ) ) {
              module.set.value(value, text, $(element));
              if(!module.is.multiple()) {
                module.hideAndClear();
              }
            }
          },

          combo: function(text, value, element) {
            value = (value !== undefined)
              ? value
              : text
            ;
            module.set.selected(value, $(element));
            module.hideAndClear();
          },

          hide: function(text, value, element) {
            module.set.value(value, text, $(element));
            module.hideAndClear();
          }

        },

        get: {
          id: function() {
            return id;
          },
          defaultText: function() {
            return $module.data(metadata.defaultText);
          },
          defaultValue: function() {
            return $module.data(metadata.defaultValue);
          },
          placeholderText: function() {
            if(settings.placeholder != 'auto' && typeof settings.placeholder == 'string') {
              return settings.placeholder;
            }
            return $module.data(metadata.placeholderText) || '';
          },
          text: function() {
            return $text.text();
          },
          query: function() {
            return String($search.val()).trim();
          },
          searchWidth: function(value) {
            value = (value !== undefined)
              ? value
              : $search.val()
            ;
            $sizer.text(value);
            // prevent rounding issues
            return Math.ceil( $sizer.width() + 1);
          },
          selectionCount: function() {
            var
              values = module.get.values(),
              count
            ;
            count = ( module.is.multiple() )
              ? Array.isArray(values)
                ? values.length
                : 0
              : (module.get.value() !== '')
                ? 1
                : 0
            ;
            return count;
          },
          transition: function($subMenu) {
            return (settings.transition == 'auto')
              ? module.is.upward($subMenu)
                ? 'slide up'
                : 'slide down'
              : settings.transition
            ;
          },
          userValues: function() {
            var
              values = module.get.values()
            ;
            if(!values) {
              return false;
            }
            values = Array.isArray(values)
              ? values
              : [values]
            ;
            return $.grep(values, function(value) {
              return (module.get.item(value) === false);
            });
          },
          uniqueArray: function(array) {
            return $.grep(array, function (value, index) {
                return $.inArray(value, array) === index;
            });
          },
          caretPosition: function(returnEndPos) {
            var
              input = $search.get(0),
              range,
              rangeLength
            ;
            if(returnEndPos && 'selectionEnd' in input){
              return input.selectionEnd;
            }
            else if(!returnEndPos && 'selectionStart' in input) {
              return input.selectionStart;
            }
            if (document.selection) {
              input.focus();
              range       = document.selection.createRange();
              rangeLength = range.text.length;
              if(returnEndPos) {
                return rangeLength;
              }
              range.moveStart('character', -input.value.length);
              return range.text.length - rangeLength;
            }
          },
          value: function() {
            var
              value = ($input.length > 0)
                ? $input.val()
                : $module.data(metadata.value),
              isEmptyMultiselect = (Array.isArray(value) && value.length === 1 && value[0] === '')
            ;
            // prevents placeholder element from being selected when multiple
            return (value === undefined || isEmptyMultiselect)
              ? ''
              : value
            ;
          },
          values: function() {
            var
              value = module.get.value()
            ;
            if(value === '') {
              return '';
            }
            return ( !module.has.selectInput() && module.is.multiple() )
              ? (typeof value == 'string') // delimited string
                ? module.escape.htmlEntities(value).split(settings.delimiter)
                : ''
              : value
            ;
          },
          remoteValues: function() {
            var
              values = module.get.values(),
              remoteValues = false
            ;
            if(values) {
              if(typeof values == 'string') {
                values = [values];
              }
              $.each(values, function(index, value) {
                var
                  name = module.read.remoteData(value)
                ;
                module.verbose('Restoring value from session data', name, value);
                if(name) {
                  if(!remoteValues) {
                    remoteValues = {};
                  }
                  remoteValues[value] = name;
                }
              });
            }
            return remoteValues;
          },
          choiceText: function($choice, preserveHTML) {
            preserveHTML = (preserveHTML !== undefined)
              ? preserveHTML
              : settings.preserveHTML
            ;
            if($choice) {
              if($choice.find(selector.menu).length > 0) {
                module.verbose('Retrieving text of element with sub-menu');
                $choice = $choice.clone();
                $choice.find(selector.menu).remove();
                $choice.find(selector.menuIcon).remove();
              }
              return ($choice.data(metadata.text) !== undefined)
                ? $choice.data(metadata.text)
                : (preserveHTML)
                  ? $choice.html().trim()
                  : $choice.text().trim()
              ;
            }
          },
          choiceValue: function($choice, choiceText) {
            choiceText = choiceText || module.get.choiceText($choice);
            if(!$choice) {
              return false;
            }
            return ($choice.data(metadata.value) !== undefined)
              ? String( $choice.data(metadata.value) )
              : (typeof choiceText === 'string')
                ? String(
                  settings.ignoreSearchCase
                  ? choiceText.toLowerCase()
                  : choiceText
                ).trim()
                : String(choiceText)
            ;
          },
          inputEvent: function() {
            var
              input = $search[0]
            ;
            if(input) {
              return (input.oninput !== undefined)
                ? 'input'
                : (input.onpropertychange !== undefined)
                  ? 'propertychange'
                  : 'keyup'
              ;
            }
            return false;
          },
          selectValues: function() {
            var
              select = {},
              oldGroup = []
            ;
            select.values = [];
            $module
              .find('option')
                .each(function() {
                  var
                    $option  = $(this),
                    name     = $option.html(),
                    disabled = $option.attr('disabled'),
                    value    = ( $option.attr('value') !== undefined )
                      ? $option.attr('value')
                      : name,
                    text     = ( $option.data(metadata.text) !== undefined )
                      ? $option.data(metadata.text)
                      : name,
                    group = $option.parent('optgroup')
                  ;
                  if(settings.placeholder === 'auto' && value === '') {
                    select.placeholder = name;
                  }
                  else {
                    if(group.length !== oldGroup.length || group[0] !== oldGroup[0]) {
                      select.values.push({
                        type: 'header',
                        divider: settings.headerDivider,
                        name: group.attr('label') || ''
                      });
                      oldGroup = group;
                    }
                    select.values.push({
                      name     : name,
                      value    : value,
                      text     : text,
                      disabled : disabled
                    });
                  }
                })
            ;
            if(settings.placeholder && settings.placeholder !== 'auto') {
              module.debug('Setting placeholder value to', settings.placeholder);
              select.placeholder = settings.placeholder;
            }
            if(settings.sortSelect) {
              if(settings.sortSelect === true) {
                select.values.sort(function(a, b) {
                  return a.name.localeCompare(b.name);
                });
              } else if(settings.sortSelect === 'natural') {
                select.values.sort(function(a, b) {
                  return (a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                });
              } else if($.isFunction(settings.sortSelect)) {
                select.values.sort(settings.sortSelect);
              }
              module.debug('Retrieved and sorted values from select', select);
            }
            else {
              module.debug('Retrieved values from select', select);
            }
            return select;
          },
          activeItem: function() {
            return $item.filter('.'  + className.active);
          },
          selectedItem: function() {
            var
              $selectedItem = $item.not(selector.unselectable).filter('.'  + className.selected)
            ;
            return ($selectedItem.length > 0)
              ? $selectedItem
              : $item.eq(0)
            ;
          },
          itemWithAdditions: function(value) {
            var
              $items       = module.get.item(value),
              $userItems   = module.create.userChoice(value),
              hasUserItems = ($userItems && $userItems.length > 0)
            ;
            if(hasUserItems) {
              $items = ($items.length > 0)
                ? $items.add($userItems)
                : $userItems
              ;
            }
            return $items;
          },
          item: function(value, strict) {
            var
              $selectedItem = false,
              shouldSearch,
              isMultiple
            ;
            value = (value !== undefined)
              ? value
              : ( module.get.values() !== undefined)
                ? module.get.values()
                : module.get.text()
            ;
            isMultiple = (module.is.multiple() && Array.isArray(value));
            shouldSearch = (isMultiple)
              ? (value.length > 0)
              : (value !== undefined && value !== null)
            ;
            strict     = (value === '' || value === false  || value === true)
              ? true
              : strict || false
            ;
            if(shouldSearch) {
              $item
                .each(function() {
                  var
                    $choice       = $(this),
                    optionText    = module.get.choiceText($choice),
                    optionValue   = module.get.choiceValue($choice, optionText)
                  ;
                  // safe early exit
                  if(optionValue === null || optionValue === undefined) {
                    return;
                  }
                  if(isMultiple) {
                    if($.inArray(module.escape.htmlEntities(String(optionValue)), value.map(function(v){return String(v);})) !== -1) {
                      $selectedItem = ($selectedItem)
                        ? $selectedItem.add($choice)
                        : $choice
                      ;
                    }
                  }
                  else if(strict) {
                    module.verbose('Ambiguous dropdown value using strict type check', $choice, value);
                    if( optionValue === value) {
                      $selectedItem = $choice;
                      return true;
                    }
                  }
                  else {
                    if(settings.ignoreCase) {
                      optionValue = optionValue.toLowerCase();
                      value = value.toLowerCase();
                    }
                    if(module.escape.htmlEntities(String(optionValue)) === module.escape.htmlEntities(String(value))) {
                      module.verbose('Found select item by value', optionValue, value);
                      $selectedItem = $choice;
                      return true;
                    }
                  }
                })
              ;
            }
            return $selectedItem;
          }
        },

        check: {
          maxSelections: function(selectionCount) {
            if(settings.maxSelections) {
              selectionCount = (selectionCount !== undefined)
                ? selectionCount
                : module.get.selectionCount()
              ;
              if(selectionCount >= settings.maxSelections) {
                module.debug('Maximum selection count reached');
                if(settings.useLabels) {
                  $item.addClass(className.filtered);
                  module.add.message(message.maxSelections);
                }
                return true;
              }
              else {
                module.verbose('No longer at maximum selection count');
                module.remove.message();
                module.remove.filteredItem();
                if(module.is.searchSelection()) {
                  module.filterItems();
                }
                return false;
              }
            }
            return true;
          }
        },

        restore: {
          defaults: function(preventChangeTrigger) {
            module.clear(preventChangeTrigger);
            module.restore.defaultText();
            module.restore.defaultValue();
          },
          defaultText: function() {
            var
              defaultText     = module.get.defaultText(),
              placeholderText = module.get.placeholderText
            ;
            if(defaultText === placeholderText) {
              module.debug('Restoring default placeholder text', defaultText);
              module.set.placeholderText(defaultText);
            }
            else {
              module.debug('Restoring default text', defaultText);
              module.set.text(defaultText);
            }
          },
          placeholderText: function() {
            module.set.placeholderText();
          },
          defaultValue: function() {
            var
              defaultValue = module.get.defaultValue()
            ;
            if(defaultValue !== undefined) {
              module.debug('Restoring default value', defaultValue);
              if(defaultValue !== '') {
                module.set.value(defaultValue);
                module.set.selected();
              }
              else {
                module.remove.activeItem();
                module.remove.selectedItem();
              }
            }
          },
          labels: function() {
            if(settings.allowAdditions) {
              if(!settings.useLabels) {
                module.error(error.labels);
                settings.useLabels = true;
              }
              module.debug('Restoring selected values');
              module.create.userLabels();
            }
            module.check.maxSelections();
          },
          selected: function() {
            module.restore.values();
            if(module.is.multiple()) {
              module.debug('Restoring previously selected values and labels');
              module.restore.labels();
            }
            else {
              module.debug('Restoring previously selected values');
            }
          },
          values: function() {
            // prevents callbacks from occurring on initial load
            module.set.initialLoad();
            if(settings.apiSettings && settings.saveRemoteData && module.get.remoteValues()) {
              module.restore.remoteValues();
            }
            else {
              module.set.selected();
            }
            var value = module.get.value();
            if(value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
              $input.removeClass(className.noselection);
            } else {
              $input.addClass(className.noselection);
            }
            module.remove.initialLoad();
          },
          remoteValues: function() {
            var
              values = module.get.remoteValues()
            ;
            module.debug('Recreating selected from session data', values);
            if(values) {
              if( module.is.single() ) {
                $.each(values, function(value, name) {
                  module.set.text(name);
                });
              }
              else {
                $.each(values, function(value, name) {
                  module.add.label(value, name);
                });
              }
            }
          }
        },

        read: {
          remoteData: function(value) {
            var
              name
            ;
            if(window.Storage === undefined) {
              module.error(error.noStorage);
              return;
            }
            name = sessionStorage.getItem(value);
            return (name !== undefined)
              ? name
              : false
            ;
          }
        },

        save: {
          defaults: function() {
            module.save.defaultText();
            module.save.placeholderText();
            module.save.defaultValue();
          },
          defaultValue: function() {
            var
              value = module.get.value()
            ;
            module.verbose('Saving default value as', value);
            $module.data(metadata.defaultValue, value);
          },
          defaultText: function() {
            var
              text = module.get.text()
            ;
            module.verbose('Saving default text as', text);
            $module.data(metadata.defaultText, text);
          },
          placeholderText: function() {
            var
              text
            ;
            if(settings.placeholder !== false && $text.hasClass(className.placeholder)) {
              text = module.get.text();
              module.verbose('Saving placeholder text as', text);
              $module.data(metadata.placeholderText, text);
            }
          },
          remoteData: function(name, value) {
            if(window.Storage === undefined) {
              module.error(error.noStorage);
              return;
            }
            module.verbose('Saving remote data to session storage', value, name);
            sessionStorage.setItem(value, name);
          }
        },

        clear: function(preventChangeTrigger) {
          if(module.is.multiple() && settings.useLabels) {
            module.remove.labels();
          }
          else {
            module.remove.activeItem();
            module.remove.selectedItem();
            module.remove.filteredItem();
          }
          module.set.placeholderText();
          module.clearValue(preventChangeTrigger);
        },

        clearValue: function(preventChangeTrigger) {
          module.set.value('', null, null, preventChangeTrigger);
        },

        scrollPage: function(direction, $selectedItem) {
          var
            $currentItem  = $selectedItem || module.get.selectedItem(),
            $menu         = $currentItem.closest(selector.menu),
            menuHeight    = $menu.outerHeight(),
            currentScroll = $menu.scrollTop(),
            itemHeight    = $item.eq(0).outerHeight(),
            itemsPerPage  = Math.floor(menuHeight / itemHeight),
            maxScroll     = $menu.prop('scrollHeight'),
            newScroll     = (direction == 'up')
              ? currentScroll - (itemHeight * itemsPerPage)
              : currentScroll + (itemHeight * itemsPerPage),
            $selectableItem = $item.not(selector.unselectable),
            isWithinRange,
            $nextSelectedItem,
            elementIndex
          ;
          elementIndex      = (direction == 'up')
            ? $selectableItem.index($currentItem) - itemsPerPage
            : $selectableItem.index($currentItem) + itemsPerPage
          ;
          isWithinRange = (direction == 'up')
            ? (elementIndex >= 0)
            : (elementIndex < $selectableItem.length)
          ;
          $nextSelectedItem = (isWithinRange)
            ? $selectableItem.eq(elementIndex)
            : (direction == 'up')
              ? $selectableItem.first()
              : $selectableItem.last()
          ;
          if($nextSelectedItem.length > 0) {
            module.debug('Scrolling page', direction, $nextSelectedItem);
            $currentItem
              .removeClass(className.selected)
            ;
            $nextSelectedItem
              .addClass(className.selected)
            ;
            if(settings.selectOnKeydown && module.is.single()) {
              module.set.selectedItem($nextSelectedItem);
            }
            $menu
              .scrollTop(newScroll)
            ;
          }
        },

        set: {
          filtered: function() {
            var
              isMultiple       = module.is.multiple(),
              isSearch         = module.is.searchSelection(),
              isSearchMultiple = (isMultiple && isSearch),
              searchValue      = (isSearch)
                ? module.get.query()
                : '',
              hasSearchValue   = (typeof searchValue === 'string' && searchValue.length > 0),
              searchWidth      = module.get.searchWidth(),
              valueIsSet       = searchValue !== ''
            ;
            if(isMultiple && hasSearchValue) {
              module.verbose('Adjusting input width', searchWidth, settings.glyphWidth);
              $search.css('width', searchWidth);
            }
            if(hasSearchValue || (isSearchMultiple && valueIsSet)) {
              module.verbose('Hiding placeholder text');
              $text.addClass(className.filtered);
            }
            else if(!isMultiple || (isSearchMultiple && !valueIsSet)) {
              module.verbose('Showing placeholder text');
              $text.removeClass(className.filtered);
            }
          },
          empty: function() {
            $module.addClass(className.empty);
          },
          loading: function() {
            $module.addClass(className.loading);
          },
          placeholderText: function(text) {
            text = text || module.get.placeholderText();
            module.debug('Setting placeholder text', text);
            module.set.text(text);
            $text.addClass(className.placeholder);
          },
          tabbable: function() {
            if( module.is.searchSelection() ) {
              module.debug('Added tabindex to searchable dropdown');
              $search
                .val('')
                .attr('tabindex', 0)
              ;
              $menu
                .attr('tabindex', -1)
              ;
            }
            else {
              module.debug('Added tabindex to dropdown');
              if( $module.attr('tabindex') === undefined) {
                $module
                  .attr('tabindex', 0)
                ;
                $menu
                  .attr('tabindex', -1)
                ;
              }
            }
          },
          initialLoad: function() {
            module.verbose('Setting initial load');
            initialLoad = true;
          },
          activeItem: function($item) {
            if( settings.allowAdditions && $item.filter(selector.addition).length > 0 ) {
              $item.addClass(className.filtered);
            }
            else {
              $item.addClass(className.active);
            }
          },
          partialSearch: function(text) {
            var
              length = module.get.query().length
            ;
            $search.val( text.substr(0, length));
          },
          scrollPosition: function($item, forceScroll) {
            var
              edgeTolerance = 5,
              $menu,
              hasActive,
              offset,
              itemHeight,
              itemOffset,
              menuOffset,
              menuScroll,
              menuHeight,
              abovePage,
              belowPage
            ;

            $item       = $item || module.get.selectedItem();
            $menu       = $item.closest(selector.menu);
            hasActive   = ($item && $item.length > 0);
            forceScroll = (forceScroll !== undefined)
              ? forceScroll
              : false
            ;
            if(module.get.activeItem().length === 0){
              forceScroll = false;
            }
            if($item && $menu.length > 0 && hasActive) {
              itemOffset = $item.position().top;

              $menu.addClass(className.loading);
              menuScroll = $menu.scrollTop();
              menuOffset = $menu.offset().top;
              itemOffset = $item.offset().top;
              offset     = menuScroll - menuOffset + itemOffset;
              if(!forceScroll) {
                menuHeight = $menu.height();
                belowPage  = menuScroll + menuHeight < (offset + edgeTolerance);
                abovePage  = ((offset - edgeTolerance) < menuScroll);
              }
              module.debug('Scrolling to active item', offset);
              if(forceScroll || abovePage || belowPage) {
                $menu.scrollTop(offset);
              }
              $menu.removeClass(className.loading);
            }
          },
          text: function(text) {
            if(settings.action === 'combo') {
              module.debug('Changing combo button text', text, $combo);
              if(settings.preserveHTML) {
                $combo.html(text);
              }
              else {
                $combo.text(text);
              }
            }
            else if(settings.action === 'activate') {
              if(text !== module.get.placeholderText()) {
                $text.removeClass(className.placeholder);
              }
              module.debug('Changing text', text, $text);
              $text
                .removeClass(className.filtered)
              ;
              if(settings.preserveHTML) {
                $text.html(text);
              }
              else {
                $text.text(text);
              }
            }
          },
          selectedItem: function($item) {
            var
              value      = module.get.choiceValue($item),
              searchText = module.get.choiceText($item, false),
              text       = module.get.choiceText($item, true)
            ;
            module.debug('Setting user selection to item', $item);
            module.remove.activeItem();
            module.set.partialSearch(searchText);
            module.set.activeItem($item);
            module.set.selected(value, $item);
            module.set.text(text);
          },
          selectedLetter: function(letter) {
            var
              $selectedItem         = $item.filter('.' + className.selected),
              alreadySelectedLetter = $selectedItem.length > 0 && module.has.firstLetter($selectedItem, letter),
              $nextValue            = false,
              $nextItem
            ;
            // check next of same letter
            if(alreadySelectedLetter) {
              $nextItem = $selectedItem.nextAll($item).eq(0);
              if( module.has.firstLetter($nextItem, letter) ) {
                $nextValue  = $nextItem;
              }
            }
            // check all values
            if(!$nextValue) {
              $item
                .each(function(){
                  if(module.has.firstLetter($(this), letter)) {
                    $nextValue = $(this);
                    return false;
                  }
                })
              ;
            }
            // set next value
            if($nextValue) {
              module.verbose('Scrolling to next value with letter', letter);
              module.set.scrollPosition($nextValue);
              $selectedItem.removeClass(className.selected);
              $nextValue.addClass(className.selected);
              if(settings.selectOnKeydown && module.is.single()) {
                module.set.selectedItem($nextValue);
              }
            }
          },
          direction: function($menu) {
            if(settings.direction == 'auto') {
              // reset position, remove upward if it's base menu
              if (!$menu) {
                module.remove.upward();
              } else if (module.is.upward($menu)) {
                //we need make sure when make assertion openDownward for $menu, $menu does not have upward class
                module.remove.upward($menu);
              }

              if(module.can.openDownward($menu)) {
                module.remove.upward($menu);
              }
              else {
                module.set.upward($menu);
              }
              if(!module.is.leftward($menu) && !module.can.openRightward($menu)) {
                module.set.leftward($menu);
              }
            }
            else if(settings.direction == 'upward') {
              module.set.upward($menu);
            }
          },
          upward: function($currentMenu) {
            var $element = $currentMenu || $module;
            $element.addClass(className.upward);
          },
          leftward: function($currentMenu) {
            var $element = $currentMenu || $menu;
            $element.addClass(className.leftward);
          },
          value: function(value, text, $selected, preventChangeTrigger) {
            if(value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
              $input.removeClass(className.noselection);
            } else {
              $input.addClass(className.noselection);
            }
            var
              escapedValue = module.escape.value(value),
              hasInput     = ($input.length > 0),
              currentValue = module.get.values(),
              stringValue  = (value !== undefined)
                ? String(value)
                : value,
              newValue
            ;
            if(hasInput) {
              if(!settings.allowReselection && stringValue == currentValue) {
                module.verbose('Skipping value update already same value', value, currentValue);
                if(!module.is.initialLoad()) {
                  return;
                }
              }

              if( module.is.single() && module.has.selectInput() && module.can.extendSelect() ) {
                module.debug('Adding user option', value);
                module.add.optionValue(value);
              }
              module.debug('Updating input value', escapedValue, currentValue);
              internalChange = true;
              $input
                .val(escapedValue)
              ;
              if(settings.fireOnInit === false && module.is.initialLoad()) {
                module.debug('Input native change event ignored on initial load');
              }
              else if(preventChangeTrigger !== true) {
                module.trigger.change();
              }
              internalChange = false;
            }
            else {
              module.verbose('Storing value in metadata', escapedValue, $input);
              if(escapedValue !== currentValue) {
                $module.data(metadata.value, stringValue);
              }
            }
            if(settings.fireOnInit === false && module.is.initialLoad()) {
              module.verbose('No callback on initial load', settings.onChange);
            }
            else if(preventChangeTrigger !== true) {
              settings.onChange.call(element, value, text, $selected);
            }
          },
          active: function() {
            $module
              .addClass(className.active)
            ;
          },
          multiple: function() {
            $module.addClass(className.multiple);
          },
          visible: function() {
            $module.addClass(className.visible);
          },
          exactly: function(value, $selectedItem) {
            module.debug('Setting selected to exact values');
            module.clear();
            module.set.selected(value, $selectedItem);
          },
          selected: function(value, $selectedItem) {
            var
              isMultiple = module.is.multiple()
            ;
            $selectedItem = (settings.allowAdditions)
              ? $selectedItem || module.get.itemWithAdditions(value)
              : $selectedItem || module.get.item(value)
            ;
            if(!$selectedItem) {
              return;
            }
            module.debug('Setting selected menu item to', $selectedItem);
            if(module.is.multiple()) {
              module.remove.searchWidth();
            }
            if(module.is.single()) {
              module.remove.activeItem();
              module.remove.selectedItem();
            }
            else if(settings.useLabels) {
              module.remove.selectedItem();
            }
            // select each item
            $selectedItem
              .each(function() {
                var
                  $selected      = $(this),
                  selectedText   = module.get.choiceText($selected),
                  selectedValue  = module.get.choiceValue($selected, selectedText),

                  isFiltered     = $selected.hasClass(className.filtered),
                  isActive       = $selected.hasClass(className.active),
                  isUserValue    = $selected.hasClass(className.addition),
                  shouldAnimate  = (isMultiple && $selectedItem.length == 1)
                ;
                if(isMultiple) {
                  if(!isActive || isUserValue) {
                    if(settings.apiSettings && settings.saveRemoteData) {
                      module.save.remoteData(selectedText, selectedValue);
                    }
                    if(settings.useLabels) {
                      module.add.label(selectedValue, selectedText, shouldAnimate);
                      module.add.value(selectedValue, selectedText, $selected);
                      module.set.activeItem($selected);
                      module.filterActive();
                      module.select.nextAvailable($selectedItem);
                    }
                    else {
                      module.add.value(selectedValue, selectedText, $selected);
                      module.set.text(module.add.variables(message.count));
                      module.set.activeItem($selected);
                    }
                  }
                  else if(!isFiltered && (settings.useLabels || selectActionActive)) {
                    module.debug('Selected active value, removing label');
                    module.remove.selected(selectedValue);
                  }
                }
                else {
                  if(settings.apiSettings && settings.saveRemoteData) {
                    module.save.remoteData(selectedText, selectedValue);
                  }
                  module.set.text(selectedText);
                  module.set.value(selectedValue, selectedText, $selected);
                  $selected
                    .addClass(className.active)
                    .addClass(className.selected)
                  ;
                }
              })
            ;
            module.remove.searchTerm();
          }
        },

        add: {
          label: function(value, text, shouldAnimate) {
            var
              $next  = module.is.searchSelection()
                ? $search
                : $text,
              escapedValue = module.escape.value(value),
              $label
            ;
            if(settings.ignoreCase) {
              escapedValue = escapedValue.toLowerCase();
            }
            $label =  $('<a />')
              .addClass(className.label)
              .attr('data-' + metadata.value, escapedValue)
              .html(templates.label(escapedValue, text, settings.preserveHTML, settings.className))
            ;
            $label = settings.onLabelCreate.call($label, escapedValue, text);

            if(module.has.label(value)) {
              module.debug('User selection already exists, skipping', escapedValue);
              return;
            }
            if(settings.label.variation) {
              $label.addClass(settings.label.variation);
            }
            if(shouldAnimate === true) {
              module.debug('Animating in label', $label);
              $label
                .addClass(className.hidden)
                .insertBefore($next)
                .transition({
                    animation  : settings.label.transition,
                    debug      : settings.debug,
                    verbose    : settings.verbose,
                    duration   : settings.label.duration
                })
              ;
            }
            else {
              module.debug('Adding selection label', $label);
              $label
                .insertBefore($next)
              ;
            }
          },
          message: function(message) {
            var
              $message = $menu.children(selector.message),
              html     = settings.templates.message(module.add.variables(message))
            ;
            if($message.length > 0) {
              $message
                .html(html)
              ;
            }
            else {
              $message = $('<div/>')
                .html(html)
                .addClass(className.message)
                .appendTo($menu)
              ;
            }
          },
          optionValue: function(value) {
            var
              escapedValue = module.escape.value(value),
              $option      = $input.find('option[value="' + module.escape.string(escapedValue) + '"]'),
              hasOption    = ($option.length > 0)
            ;
            if(hasOption) {
              return;
            }
            // temporarily disconnect observer
            module.disconnect.selectObserver();
            if( module.is.single() ) {
              module.verbose('Removing previous user addition');
              $input.find('option.' + className.addition).remove();
            }
            $('<option/>')
              .prop('value', escapedValue)
              .addClass(className.addition)
              .html(value)
              .appendTo($input)
            ;
            module.verbose('Adding user addition as an <option>', value);
            module.observe.select();
          },
          userSuggestion: function(value) {
            var
              $addition         = $menu.children(selector.addition),
              $existingItem     = module.get.item(value),
              alreadyHasValue   = $existingItem && $existingItem.not(selector.addition).length,
              hasUserSuggestion = $addition.length > 0,
              html
            ;
            if(settings.useLabels && module.has.maxSelections()) {
              return;
            }
            if(value === '' || alreadyHasValue) {
              $addition.remove();
              return;
            }
            if(hasUserSuggestion) {
              $addition
                .data(metadata.value, value)
                .data(metadata.text, value)
                .attr('data-' + metadata.value, value)
                .attr('data-' + metadata.text, value)
                .removeClass(className.filtered)
              ;
              if(!settings.hideAdditions) {
                html = settings.templates.addition( module.add.variables(message.addResult, value) );
                $addition
                  .html(html)
                ;
              }
              module.verbose('Replacing user suggestion with new value', $addition);
            }
            else {
              $addition = module.create.userChoice(value);
              $addition
                .prependTo($menu)
              ;
              module.verbose('Adding item choice to menu corresponding with user choice addition', $addition);
            }
            if(!settings.hideAdditions || module.is.allFiltered()) {
              $addition
                .addClass(className.selected)
                .siblings()
                .removeClass(className.selected)
              ;
            }
            module.refreshItems();
          },
          variables: function(message, term) {
            var
              hasCount    = (message.search('{count}') !== -1),
              hasMaxCount = (message.search('{maxCount}') !== -1),
              hasTerm     = (message.search('{term}') !== -1),
              count,
              query
            ;
            module.verbose('Adding templated variables to message', message);
            if(hasCount) {
              count  = module.get.selectionCount();
              message = message.replace('{count}', count);
            }
            if(hasMaxCount) {
              count  = module.get.selectionCount();
              message = message.replace('{maxCount}', settings.maxSelections);
            }
            if(hasTerm) {
              query   = term || module.get.query();
              message = message.replace('{term}', query);
            }
            return message;
          },
          value: function(addedValue, addedText, $selectedItem) {
            var
              currentValue = module.get.values(),
              newValue
            ;
            if(module.has.value(addedValue)) {
              module.debug('Value already selected');
              return;
            }
            if(addedValue === '') {
              module.debug('Cannot select blank values from multiselect');
              return;
            }
            // extend current array
            if(Array.isArray(currentValue)) {
              newValue = currentValue.concat([addedValue]);
              newValue = module.get.uniqueArray(newValue);
            }
            else {
              newValue = [addedValue];
            }
            // add values
            if( module.has.selectInput() ) {
              if(module.can.extendSelect()) {
                module.debug('Adding value to select', addedValue, newValue, $input);
                module.add.optionValue(addedValue);
              }
            }
            else {
              newValue = newValue.join(settings.delimiter);
              module.debug('Setting hidden input to delimited value', newValue, $input);
            }

            if(settings.fireOnInit === false && module.is.initialLoad()) {
              module.verbose('Skipping onadd callback on initial load', settings.onAdd);
            }
            else {
              settings.onAdd.call(element, addedValue, addedText, $selectedItem);
            }
            module.set.value(newValue, addedText, $selectedItem);
            module.check.maxSelections();
          },
        },

        remove: {
          active: function() {
            $module.removeClass(className.active);
          },
          activeLabel: function() {
            $module.find(selector.label).removeClass(className.active);
          },
          empty: function() {
            $module.removeClass(className.empty);
          },
          loading: function() {
            $module.removeClass(className.loading);
          },
          initialLoad: function() {
            initialLoad = false;
          },
          upward: function($currentMenu) {
            var $element = $currentMenu || $module;
            $element.removeClass(className.upward);
          },
          leftward: function($currentMenu) {
            var $element = $currentMenu || $menu;
            $element.removeClass(className.leftward);
          },
          visible: function() {
            $module.removeClass(className.visible);
          },
          activeItem: function() {
            $item.removeClass(className.active);
          },
          filteredItem: function() {
            if(settings.useLabels && module.has.maxSelections() ) {
              return;
            }
            if(settings.useLabels && module.is.multiple()) {
              $item.not('.' + className.active).removeClass(className.filtered);
            }
            else {
              $item.removeClass(className.filtered);
            }
            if(settings.hideDividers) {
              $divider.removeClass(className.hidden);
            }
            module.remove.empty();
          },
          optionValue: function(value) {
            var
              escapedValue = module.escape.value(value),
              $option      = $input.find('option[value="' + module.escape.string(escapedValue) + '"]'),
              hasOption    = ($option.length > 0)
            ;
            if(!hasOption || !$option.hasClass(className.addition)) {
              return;
            }
            // temporarily disconnect observer
            if(selectObserver) {
              selectObserver.disconnect();
              module.verbose('Temporarily disconnecting mutation observer');
            }
            $option.remove();
            module.verbose('Removing user addition as an <option>', escapedValue);
            if(selectObserver) {
              selectObserver.observe($input[0], {
                childList : true,
                subtree   : true
              });
            }
          },
          message: function() {
            $menu.children(selector.message).remove();
          },
          searchWidth: function() {
            $search.css('width', '');
          },
          searchTerm: function() {
            module.verbose('Cleared search term');
            $search.val('');
            module.set.filtered();
          },
          userAddition: function() {
            $item.filter(selector.addition).remove();
          },
          selected: function(value, $selectedItem) {
            $selectedItem = (settings.allowAdditions)
              ? $selectedItem || module.get.itemWithAdditions(value)
              : $selectedItem || module.get.item(value)
            ;

            if(!$selectedItem) {
              return false;
            }

            $selectedItem
              .each(function() {
                var
                  $selected     = $(this),
                  selectedText  = module.get.choiceText($selected),
                  selectedValue = module.get.choiceValue($selected, selectedText)
                ;
                if(module.is.multiple()) {
                  if(settings.useLabels) {
                    module.remove.value(selectedValue, selectedText, $selected);
                    module.remove.label(selectedValue);
                  }
                  else {
                    module.remove.value(selectedValue, selectedText, $selected);
                    if(module.get.selectionCount() === 0) {
                      module.set.placeholderText();
                    }
                    else {
                      module.set.text(module.add.variables(message.count));
                    }
                  }
                }
                else {
                  module.remove.value(selectedValue, selectedText, $selected);
                }
                $selected
                  .removeClass(className.filtered)
                  .removeClass(className.active)
                ;
                if(settings.useLabels) {
                  $selected.removeClass(className.selected);
                }
              })
            ;
          },
          selectedItem: function() {
            $item.removeClass(className.selected);
          },
          value: function(removedValue, removedText, $removedItem) {
            var
              values = module.get.values(),
              newValue
            ;
            removedValue = module.escape.htmlEntities(removedValue);
            if( module.has.selectInput() ) {
              module.verbose('Input is <select> removing selected option', removedValue);
              newValue = module.remove.arrayValue(removedValue, values);
              module.remove.optionValue(removedValue);
            }
            else {
              module.verbose('Removing from delimited values', removedValue);
              newValue = module.remove.arrayValue(removedValue, values);
              newValue = newValue.join(settings.delimiter);
            }
            if(settings.fireOnInit === false && module.is.initialLoad()) {
              module.verbose('No callback on initial load', settings.onRemove);
            }
            else {
              settings.onRemove.call(element, removedValue, removedText, $removedItem);
            }
            module.set.value(newValue, removedText, $removedItem);
            module.check.maxSelections();
          },
          arrayValue: function(removedValue, values) {
            if( !Array.isArray(values) ) {
              values = [values];
            }
            values = $.grep(values, function(value){
              return (removedValue != value);
            });
            module.verbose('Removed value from delimited string', removedValue, values);
            return values;
          },
          label: function(value, shouldAnimate) {
            var
              $labels       = $module.find(selector.label),
              $removedLabel = $labels.filter('[data-' + metadata.value + '="' + module.escape.string(settings.ignoreCase ? value.toLowerCase() : value) +'"]')
            ;
            module.verbose('Removing label', $removedLabel);
            $removedLabel.remove();
          },
          activeLabels: function($activeLabels) {
            $activeLabels = $activeLabels || $module.find(selector.label).filter('.' + className.active);
            module.verbose('Removing active label selections', $activeLabels);
            module.remove.labels($activeLabels);
          },
          labels: function($labels) {
            $labels = $labels || $module.find(selector.label);
            module.verbose('Removing labels', $labels);
            $labels
              .each(function(){
                var
                  $label      = $(this),
                  value       = $label.data(metadata.value),
                  stringValue = (value !== undefined)
                    ? String(value)
                    : value,
                  isUserValue = module.is.userValue(stringValue)
                ;
                if(settings.onLabelRemove.call($label, value) === false) {
                  module.debug('Label remove callback cancelled removal');
                  return;
                }
                module.remove.message();
                if(isUserValue) {
                  module.remove.value(stringValue);
                  module.remove.label(stringValue);
                }
                else {
                  // selected will also remove label
                  module.remove.selected(stringValue);
                }
              })
            ;
          },
          tabbable: function() {
            if( module.is.searchSelection() ) {
              module.debug('Searchable dropdown initialized');
              $search
                .removeAttr('tabindex')
              ;
              $menu
                .removeAttr('tabindex')
              ;
            }
            else {
              module.debug('Simple selection dropdown initialized');
              $module
                .removeAttr('tabindex')
              ;
              $menu
                .removeAttr('tabindex')
              ;
            }
          },
          diacritics: function(text) {
            return settings.ignoreDiacritics ?  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : text;
          }
        },

        has: {
          menuSearch: function() {
            return (module.has.search() && $search.closest($menu).length > 0);
          },
          clearItem: function() {
            return ($clear.length > 0);
          },
          search: function() {
            return ($search.length > 0);
          },
          sizer: function() {
            return ($sizer.length > 0);
          },
          selectInput: function() {
            return ( $input.is('select') );
          },
          minCharacters: function(searchTerm) {
            if(settings.minCharacters && !iconClicked) {
              searchTerm = (searchTerm !== undefined)
                ? String(searchTerm)
                : String(module.get.query())
              ;
              return (searchTerm.length >= settings.minCharacters);
            }
            iconClicked=false;
            return true;
          },
          firstLetter: function($item, letter) {
            var
              text,
              firstLetter
            ;
            if(!$item || $item.length === 0 || typeof letter !== 'string') {
              return false;
            }
            text        = module.get.choiceText($item, false);
            letter      = letter.toLowerCase();
            firstLetter = String(text).charAt(0).toLowerCase();
            return (letter == firstLetter);
          },
          input: function() {
            return ($input.length > 0);
          },
          items: function() {
            return ($item.length > 0);
          },
          menu: function() {
            return ($menu.length > 0);
          },
          message: function() {
            return ($menu.children(selector.message).length !== 0);
          },
          label: function(value) {
            var
              escapedValue = module.escape.value(value),
              $labels      = $module.find(selector.label)
            ;
            if(settings.ignoreCase) {
              escapedValue = escapedValue.toLowerCase();
            }
            return ($labels.filter('[data-' + metadata.value + '="' + module.escape.string(escapedValue) +'"]').length > 0);
          },
          maxSelections: function() {
            return (settings.maxSelections && module.get.selectionCount() >= settings.maxSelections);
          },
          allResultsFiltered: function() {
            var
              $normalResults = $item.not(selector.addition)
            ;
            return ($normalResults.filter(selector.unselectable).length === $normalResults.length);
          },
          userSuggestion: function() {
            return ($menu.children(selector.addition).length > 0);
          },
          query: function() {
            return (module.get.query() !== '');
          },
          value: function(value) {
            return (settings.ignoreCase)
              ? module.has.valueIgnoringCase(value)
              : module.has.valueMatchingCase(value)
            ;
          },
          valueMatchingCase: function(value) {
            var
              values   = module.get.values(),
              hasValue = Array.isArray(values)
               ? values && ($.inArray(value, values) !== -1)
               : (values == value)
            ;
            return (hasValue)
              ? true
              : false
            ;
          },
          valueIgnoringCase: function(value) {
            var
              values   = module.get.values(),
              hasValue = false
            ;
            if(!Array.isArray(values)) {
              values = [values];
            }
            $.each(values, function(index, existingValue) {
              if(String(value).toLowerCase() == String(existingValue).toLowerCase()) {
                hasValue = true;
                return false;
              }
            });
            return hasValue;
          }
        },

        is: {
          active: function() {
            return $module.hasClass(className.active);
          },
          animatingInward: function() {
            return $menu.transition('is inward');
          },
          animatingOutward: function() {
            return $menu.transition('is outward');
          },
          bubbledLabelClick: function(event) {
            return $(event.target).is('select, input') && $module.closest('label').length > 0;
          },
          bubbledIconClick: function(event) {
            return $(event.target).closest($icon).length > 0;
          },
          alreadySetup: function() {
            return ($module.is('select') && $module.parent(selector.dropdown).data(moduleNamespace) !== undefined && $module.prev().length === 0);
          },
          animating: function($subMenu) {
            return ($subMenu)
              ? $subMenu.transition && $subMenu.transition('is animating')
              : $menu.transition    && $menu.transition('is animating')
            ;
          },
          leftward: function($subMenu) {
            var $selectedMenu = $subMenu || $menu;
            return $selectedMenu.hasClass(className.leftward);
          },
          clearable: function() {
            return ($module.hasClass(className.clearable) || settings.clearable);
          },
          disabled: function() {
            return $module.hasClass(className.disabled);
          },
          focused: function() {
            return (document.activeElement === $module[0]);
          },
          focusedOnSearch: function() {
            return (document.activeElement === $search[0]);
          },
          allFiltered: function() {
            return( (module.is.multiple() || module.has.search()) && !(settings.hideAdditions == false && module.has.userSuggestion()) && !module.has.message() && module.has.allResultsFiltered() );
          },
          hidden: function($subMenu) {
            return !module.is.visible($subMenu);
          },
          initialLoad: function() {
            return initialLoad;
          },
          inObject: function(needle, object) {
            var
              found = false
            ;
            $.each(object, function(index, property) {
              if(property == needle) {
                found = true;
                return true;
              }
            });
            return found;
          },
          multiple: function() {
            return $module.hasClass(className.multiple);
          },
          remote: function() {
            return settings.apiSettings && module.can.useAPI();
          },
          single: function() {
            return !module.is.multiple();
          },
          selectMutation: function(mutations) {
            var
              selectChanged = false
            ;
            $.each(mutations, function(index, mutation) {
              if($(mutation.target).is('select') || $(mutation.addedNodes).is('select')) {
                selectChanged = true;
                return false;
              }
            });
            return selectChanged;
          },
          search: function() {
            return $module.hasClass(className.search);
          },
          searchSelection: function() {
            return ( module.has.search() && $search.parent(selector.dropdown).length === 1 );
          },
          selection: function() {
            return $module.hasClass(className.selection);
          },
          userValue: function(value) {
            return ($.inArray(value, module.get.userValues()) !== -1);
          },
          upward: function($menu) {
            var $element = $menu || $module;
            return $element.hasClass(className.upward);
          },
          visible: function($subMenu) {
            return ($subMenu)
              ? $subMenu.hasClass(className.visible)
              : $menu.hasClass(className.visible)
            ;
          },
          verticallyScrollableContext: function() {
            var
              overflowY = ($context.get(0) !== window)
                ? $context.css('overflow-y')
                : false
            ;
            return (overflowY == 'auto' || overflowY == 'scroll');
          },
          horizontallyScrollableContext: function() {
            var
              overflowX = ($context.get(0) !== window)
                ? $context.css('overflow-X')
                : false
            ;
            return (overflowX == 'auto' || overflowX == 'scroll');
          }
        },

        can: {
          activate: function($item) {
            if(settings.useLabels) {
              return true;
            }
            if(!module.has.maxSelections()) {
              return true;
            }
            if(module.has.maxSelections() && $item.hasClass(className.active)) {
              return true;
            }
            return false;
          },
          openDownward: function($subMenu) {
            var
              $currentMenu    = $subMenu || $menu,
              canOpenDownward = true,
              onScreen        = {},
              calculations
            ;
            $currentMenu
              .addClass(className.loading)
            ;
            calculations = {
              context: {
                offset    : ($context.get(0) === window)
                  ? { top: 0, left: 0}
                  : $context.offset(),
                scrollTop : $context.scrollTop(),
                height    : $context.outerHeight()
              },
              menu : {
                offset: $currentMenu.offset(),
                height: $currentMenu.outerHeight()
              }
            };
            if(module.is.verticallyScrollableContext()) {
              calculations.menu.offset.top += calculations.context.scrollTop;
            }
            onScreen = {
              above : (calculations.context.scrollTop) <= calculations.menu.offset.top - calculations.context.offset.top - calculations.menu.height,
              below : (calculations.context.scrollTop + calculations.context.height) >= calculations.menu.offset.top - calculations.context.offset.top + calculations.menu.height
            };
            if(onScreen.below) {
              module.verbose('Dropdown can fit in context downward', onScreen);
              canOpenDownward = true;
            }
            else if(!onScreen.below && !onScreen.above) {
              module.verbose('Dropdown cannot fit in either direction, favoring downward', onScreen);
              canOpenDownward = true;
            }
            else {
              module.verbose('Dropdown cannot fit below, opening upward', onScreen);
              canOpenDownward = false;
            }
            $currentMenu.removeClass(className.loading);
            return canOpenDownward;
          },
          openRightward: function($subMenu) {
            var
              $currentMenu     = $subMenu || $menu,
              canOpenRightward = true,
              isOffscreenRight = false,
              calculations
            ;
            $currentMenu
              .addClass(className.loading)
            ;
            calculations = {
              context: {
                offset     : ($context.get(0) === window)
                  ? { top: 0, left: 0}
                  : $context.offset(),
                scrollLeft : $context.scrollLeft(),
                width      : $context.outerWidth()
              },
              menu: {
                offset : $currentMenu.offset(),
                width  : $currentMenu.outerWidth()
              }
            };
            if(module.is.horizontallyScrollableContext()) {
              calculations.menu.offset.left += calculations.context.scrollLeft;
            }
            isOffscreenRight = (calculations.menu.offset.left - calculations.context.offset.left + calculations.menu.width >= calculations.context.scrollLeft + calculations.context.width);
            if(isOffscreenRight) {
              module.verbose('Dropdown cannot fit in context rightward', isOffscreenRight);
              canOpenRightward = false;
            }
            $currentMenu.removeClass(className.loading);
            return canOpenRightward;
          },
          click: function() {
            return (hasTouch || settings.on == 'click');
          },
          extendSelect: function() {
            return settings.allowAdditions || settings.apiSettings;
          },
          show: function() {
            return !module.is.disabled() && (module.has.items() || module.has.message());
          },
          useAPI: function() {
            return $.fn.api !== undefined;
          }
        },

        animate: {
          show: function(callback, $subMenu) {
            var
              $currentMenu = $subMenu || $menu,
              start = ($subMenu)
                ? function() {}
                : function() {
                  module.hideSubMenus();
                  module.hideOthers();
                  module.set.active();
                },
              transition
            ;
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            module.verbose('Doing menu show animation', $currentMenu);
            module.set.direction($subMenu);
            transition = module.get.transition($subMenu);
            if( module.is.selection() ) {
              module.set.scrollPosition(module.get.selectedItem(), true);
            }
            if( module.is.hidden($currentMenu) || module.is.animating($currentMenu) ) {
              if(transition == 'none') {
                start();
                $currentMenu.transition('show');
                callback.call(element);
              }
              else if($.fn.transition !== undefined && $module.transition('is supported')) {
                $currentMenu
                  .transition({
                    animation  : transition + ' in',
                    debug      : settings.debug,
                    verbose    : settings.verbose,
                    duration   : settings.duration,
                    queue      : true,
                    onStart    : start,
                    onComplete : function() {
                      callback.call(element);
                    }
                  })
                ;
              }
              else {
                module.error(error.noTransition, transition);
              }
            }
          },
          hide: function(callback, $subMenu) {
            var
              $currentMenu = $subMenu || $menu,
              start = ($subMenu)
                ? function() {}
                : function() {
                  if( module.can.click() ) {
                    module.unbind.intent();
                  }
                  module.remove.active();
                },
              transition = module.get.transition($subMenu)
            ;
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if( module.is.visible($currentMenu) || module.is.animating($currentMenu) ) {
              module.verbose('Doing menu hide animation', $currentMenu);

              if(transition == 'none') {
                start();
                $currentMenu.transition('hide');
                callback.call(element);
              }
              else if($.fn.transition !== undefined && $module.transition('is supported')) {
                $currentMenu
                  .transition({
                    animation  : transition + ' out',
                    duration   : settings.duration,
                    debug      : settings.debug,
                    verbose    : settings.verbose,
                    queue      : false,
                    onStart    : start,
                    onComplete : function() {
                      callback.call(element);
                    }
                  })
                ;
              }
              else {
                module.error(error.transition);
              }
            }
          }
        },

        hideAndClear: function() {
          module.remove.searchTerm();
          if( module.has.maxSelections() ) {
            return;
          }
          if(module.has.search()) {
            module.hide(function() {
              module.remove.filteredItem();
            });
          }
          else {
            module.hide();
          }
        },

        delay: {
          show: function() {
            module.verbose('Delaying show event to ensure user intent');
            clearTimeout(module.timer);
            module.timer = setTimeout(module.show, settings.delay.show);
          },
          hide: function() {
            module.verbose('Delaying hide event to ensure user intent');
            clearTimeout(module.timer);
            module.timer = setTimeout(module.hide, settings.delay.hide);
          }
        },

        escape: {
          value: function(value) {
            var
              multipleValues = Array.isArray(value),
              stringValue    = (typeof value === 'string'),
              isUnparsable   = (!stringValue && !multipleValues),
              hasQuotes      = (stringValue && value.search(regExp.quote) !== -1),
              values         = []
            ;
            if(isUnparsable || !hasQuotes) {
              return value;
            }
            module.debug('Encoding quote values for use in select', value);
            if(multipleValues) {
              $.each(value, function(index, value){
                values.push(value.replace(regExp.quote, '&quot;'));
              });
              return values;
            }
            return value.replace(regExp.quote, '&quot;');
          },
          string: function(text) {
            text =  String(text);
            return text.replace(regExp.escape, '\\$&');
          },
          htmlEntities: function(string) {
              var
                  badChars     = /[<>"'`]/g,
                  shouldEscape = /[&<>"'`]/,
                  escape       = {
                      "<": "&lt;",
                      ">": "&gt;",
                      '"': "&quot;",
                      "'": "&#x27;",
                      "`": "&#x60;"
                  },
                  escapedChar  = function(chr) {
                      return escape[chr];
                  }
              ;
              if(shouldEscape.test(string)) {
                  string = string.replace(/&(?![a-z0-9#]{1,6};)/, "&amp;");
                  return string.replace(badChars, escapedChar);
              }
              return string;
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            if($.isPlainObject(settings[name])) {
              $.extend(true, settings[name], value);
            }
            else {
              settings[name] = value;
            }
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(!settings.silent && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(!settings.silent && settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          if(!settings.silent) {
            module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
            module.error.apply(console, arguments);
          }
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if(Array.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;
  return (returnedValue !== undefined)
    ? returnedValue
    : $allModules
  ;
};

$.fn.dropdown.settings = {

  silent                 : false,
  debug                  : false,
  verbose                : false,
  performance            : true,

  on                     : 'click',    // what event should show menu action on item selection
  action                 : 'activate', // action on item selection (nothing, activate, select, combo, hide, function(){})

  values                 : false,      // specify values to use for dropdown

  clearable              : false,      // whether the value of the dropdown can be cleared

  apiSettings            : false,
  selectOnKeydown        : true,       // Whether selection should occur automatically when keyboard shortcuts used
  minCharacters          : 0,          // Minimum characters required to trigger API call

  filterRemoteData       : false,      // Whether API results should be filtered after being returned for query term
  saveRemoteData         : true,       // Whether remote name/value pairs should be stored in sessionStorage to allow remote data to be restored on page refresh

  throttle               : 200,        // How long to wait after last user input to search remotely

  context                : window,     // Context to use when determining if on screen
  direction              : 'auto',     // Whether dropdown should always open in one direction
  keepOnScreen           : true,       // Whether dropdown should check whether it is on screen before showing

  match                  : 'both',     // what to match against with search selection (both, text, or label)
  fullTextSearch         : false,      // search anywhere in value (set to 'exact' to require exact matches)
  ignoreDiacritics       : false,      // match results also if they contain diacritics of the same base character (for example searching for "a" will also match "á" or "â" or "à", etc...)
  hideDividers           : false,      // Whether to hide any divider elements (specified in selector.divider) that are sibling to any items when searched (set to true will hide all dividers, set to 'empty' will hide them when they are not followed by a visible item)

  placeholder            : 'auto',     // whether to convert blank <select> values to placeholder text
  preserveHTML           : true,       // preserve html when selecting value
  sortSelect             : false,      // sort selection on init

  forceSelection         : true,       // force a choice on blur with search selection

  allowAdditions         : false,      // whether multiple select should allow user added values
  ignoreCase             : false,      // whether to consider case sensitivity when creating labels
  ignoreSearchCase       : true,       // whether to consider case sensitivity when filtering items
  hideAdditions          : true,       // whether or not to hide special message prompting a user they can enter a value

  maxSelections          : false,      // When set to a number limits the number of selections to this count
  useLabels              : true,       // whether multiple select should filter currently active selections from choices
  delimiter              : ',',        // when multiselect uses normal <input> the values will be delimited with this character

  showOnFocus            : true,       // show menu on focus
  allowReselection       : false,      // whether current value should trigger callbacks when reselected
  allowTab               : true,       // add tabindex to element
  allowCategorySelection : false,      // allow elements with sub-menus to be selected

  fireOnInit             : false,      // Whether callbacks should fire when initializing dropdown values

  transition             : 'auto',     // auto transition will slide down or up based on direction
  duration               : 200,        // duration of transition

  glyphWidth             : 1.037,      // widest glyph width in em (W is 1.037 em) used to calculate multiselect input width

  headerDivider          : true,       // whether option headers should have an additional divider line underneath when converted from <select> <optgroup>

  // label settings on multi-select
  label: {
    transition : 'scale',
    duration   : 200,
    variation  : false
  },

  // delay before event
  delay : {
    hide   : 300,
    show   : 200,
    search : 20,
    touch  : 50
  },

  /* Callbacks */
  onChange      : function(value, text, $selected){},
  onAdd         : function(value, text, $selected){},
  onRemove      : function(value, text, $selected){},

  onLabelSelect : function($selectedLabels){},
  onLabelCreate : function(value, text) { return $(this); },
  onLabelRemove : function(value) { return true; },
  onNoResults   : function(searchTerm) { return true; },
  onShow        : function(){},
  onHide        : function(){},

  /* Component */
  name           : 'Dropdown',
  namespace      : 'dropdown',

  message: {
    addResult     : 'Add <b>{term}</b>',
    count         : '{count} selected',
    maxSelections : 'Max {maxCount} selections',
    noResults     : 'No results found.',
    serverError   : 'There was an error contacting the server'
  },

  error : {
    action          : 'You called a dropdown action that was not defined',
    alreadySetup    : 'Once a select has been initialized behaviors must be called on the created ui dropdown',
    labels          : 'Allowing user additions currently requires the use of labels.',
    missingMultiple : '<select> requires multiple property to be set to correctly preserve multiple values',
    method          : 'The method you called is not defined.',
    noAPI           : 'The API module is required to load resources remotely',
    noStorage       : 'Saving remote data requires session storage',
    noTransition    : 'This module requires ui transitions <https://github.com/Semantic-Org/UI-Transition>',
    noNormalize     : '"ignoreDiacritics" setting will be ignored. Browser does not support String().normalize(). You may consider including <https://cdn.jsdelivr.net/npm/unorm@1.4.1/lib/unorm.min.js> as a polyfill.'
  },

  regExp : {
    escape   : /[-[\]{}()*+?.,\\^$|#\s:=@]/g,
    quote    : /"/g
  },

  metadata : {
    defaultText     : 'defaultText',
    defaultValue    : 'defaultValue',
    placeholderText : 'placeholder',
    text            : 'text',
    value           : 'value'
  },

  // property names for remote query
  fields: {
    remoteValues : 'results',  // grouping for api results
    values       : 'values',   // grouping for all dropdown values
    disabled     : 'disabled', // whether value should be disabled
    name         : 'name',     // displayed dropdown text
    value        : 'value',    // actual dropdown value
    text         : 'text',     // displayed text when selected
    type         : 'type',     // type of dropdown element
    image        : 'image',    // optional image path
    imageClass   : 'imageClass', // optional individual class for image
    icon         : 'icon',     // optional icon name
    iconClass    : 'iconClass', // optional individual class for icon (for example to use flag instead)
    class        : 'class',    // optional individual class for item/header
    divider      : 'divider'   // optional divider append for group headers
  },

  keys : {
    backspace  : 8,
    delimiter  : 188, // comma
    deleteKey  : 46,
    enter      : 13,
    escape     : 27,
    pageUp     : 33,
    pageDown   : 34,
    leftArrow  : 37,
    upArrow    : 38,
    rightArrow : 39,
    downArrow  : 40
  },

  selector : {
    addition     : '.addition',
    divider      : '.divider, .header',
    dropdown     : '.ui.dropdown',
    hidden       : '.hidden',
    icon         : '> .dropdown.icon',
    input        : '> input[type="hidden"], > select',
    item         : '.item',
    label        : '> .label',
    remove       : '> .label > .delete.icon',
    siblingLabel : '.label',
    menu         : '.menu',
    message      : '.message',
    menuIcon     : '.dropdown.icon',
    search       : 'input.search, .menu > .search > input, .menu input.search',
    sizer        : '> span.sizer',
    text         : '> .text:not(.icon)',
    unselectable : '.disabled, .filtered',
    clearIcon    : '> .remove.icon'
  },

  className : {
    active      : 'active',
    addition    : 'addition',
    animating   : 'animating',
    disabled    : 'disabled',
    empty       : 'empty',
    dropdown    : 'ui dropdown',
    filtered    : 'filtered',
    hidden      : 'hidden transition',
    icon        : 'icon',
    image       : 'image',
    item        : 'item',
    label       : 'ui label',
    loading     : 'loading',
    menu        : 'menu',
    message     : 'message',
    multiple    : 'multiple',
    placeholder : 'default',
    sizer       : 'sizer',
    search      : 'search',
    selected    : 'selected',
    selection   : 'selection',
    upward      : 'upward',
    leftward    : 'left',
    visible     : 'visible',
    clearable   : 'clearable',
    noselection : 'noselection',
    delete      : 'delete',
    header      : 'header',
    divider     : 'divider',
    groupIcon   : '',
    unfilterable : 'unfilterable'
  }

};

/* Templates */
$.fn.dropdown.settings.templates = {
  deQuote: function(string) {
      return String(string).replace(/"/g,"");
  },
  escape: function(string, preserveHTML) {
    if (preserveHTML){
      return string;
    }
    var
        badChars     = /[<>"'`]/g,
        shouldEscape = /[&<>"'`]/,
        escape       = {
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#x27;",
          "`": "&#x60;"
        },
        escapedChar  = function(chr) {
          return escape[chr];
        }
    ;
    if(shouldEscape.test(string)) {
      string = string.replace(/&(?![a-z0-9#]{1,6};)/, "&amp;");
      return string.replace(badChars, escapedChar);
    }
    return string;
  },
  // generates dropdown from select values
  dropdown: function(select, fields, preserveHTML, className) {
    var
      placeholder = select.placeholder || false,
      html        = '',
      escape = $.fn.dropdown.settings.templates.escape
    ;
    html +=  '<i class="dropdown icon"></i>';
    if(placeholder) {
      html += '<div class="default text">' + escape(placeholder,preserveHTML) + '</div>';
    }
    else {
      html += '<div class="text"></div>';
    }
    html += '<div class="'+className.menu+'">';
    html += $.fn.dropdown.settings.templates.menu(select, fields, preserveHTML,className);
    html += '</div>';
    return html;
  },

  // generates just menu from select
  menu: function(response, fields, preserveHTML, className) {
    var
      values = response[fields.values] || [],
      html   = '',
      escape = $.fn.dropdown.settings.templates.escape,
      deQuote = $.fn.dropdown.settings.templates.deQuote
    ;
    $.each(values, function(index, option) {
      var
        itemType = (option[fields.type])
          ? option[fields.type]
          : 'item'
      ;

      if( itemType === 'item' ) {
        var
          maybeText = (option[fields.text])
            ? ' data-text="' + deQuote(option[fields.text]) + '"'
            : '',
          maybeDisabled = (option[fields.disabled])
            ? className.disabled+' '
            : ''
        ;
        html += '<div class="'+ maybeDisabled + (option[fields.class] ? deQuote(option[fields.class]) : className.item)+'" data-value="' + deQuote(option[fields.value]) + '"' + maybeText + '>';
        if(option[fields.image]) {
          html += '<img class="'+(option[fields.imageClass] ? deQuote(option[fields.imageClass]) : className.image)+'" src="' + deQuote(option[fields.image]) + '">';
        }
        if(option[fields.icon]) {
          html += '<i class="'+deQuote(option[fields.icon])+' '+(option[fields.iconClass] ? deQuote(option[fields.iconClass]) : className.icon)+'"></i>';
        }
        html +=   escape(option[fields.name] || '', preserveHTML);
        html += '</div>';
      } else if (itemType === 'header') {
        var groupName = escape(option[fields.name] || '', preserveHTML),
            groupIcon = option[fields.icon] ? deQuote(option[fields.icon]) : className.groupIcon
        ;
        if(groupName !== '' || groupIcon !== '') {
          html += '<div class="' + (option[fields.class] ? deQuote(option[fields.class]) : className.header) + '">';
          if (groupIcon !== '') {
            html += '<i class="' + groupIcon + ' ' + (option[fields.iconClass] ? deQuote(option[fields.iconClass]) : className.icon) + '"></i>';
          }
          html += groupName;
          html += '</div>';
        }
        if(option[fields.divider]){
          html += '<div class="'+className.divider+'"></div>';
        }
      }
    });
    return html;
  },

  // generates label for multiselect
  label: function(value, text, preserveHTML, className) {
    var
        escape = $.fn.dropdown.settings.templates.escape;
    return escape(text,preserveHTML) + '<i class="'+className.delete+' icon"></i>';
  },


  // generates messages like "No results"
  message: function(message) {
    return message;
  },

  // generates user addition to selection menu
  addition: function(choice) {
    return choice;
  }

};

})( jQuery, window, document );

/*!
 * # Fomantic-UI - Sticky
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

'use strict';

$.isFunction = $.isFunction || function(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
};

window = (typeof window != 'undefined' && window.Math == Math)
  ? window
  : (typeof self != 'undefined' && self.Math == Math)
    ? self
    : Function('return this')()
;

$.fn.sticky = function(parameters) {
  var
    $allModules    = $(this),
    moduleSelector = $allModules.selector || '',

    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),
    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings              = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.sticky.settings, parameters)
          : $.extend({}, $.fn.sticky.settings),

        className             = settings.className,
        namespace             = settings.namespace,
        error                 = settings.error,

        eventNamespace        = '.' + namespace,
        moduleNamespace       = 'module-' + namespace,

        $module               = $(this),
        $window               = $(window),
        $scroll               = $(settings.scrollContext),
        $container,
        $context,

        instance              = $module.data(moduleNamespace),

        requestAnimationFrame = window.requestAnimationFrame
          || window.mozRequestAnimationFrame
          || window.webkitRequestAnimationFrame
          || window.msRequestAnimationFrame
          || function(callback) { setTimeout(callback, 0); },

        element         = this,

        documentObserver,
        observer,
        module
      ;

      module      = {

        initialize: function() {

          module.determineContainer();
          module.determineContext();
          module.verbose('Initializing sticky', settings, $container);

          module.save.positions();
          module.checkErrors();
          module.bind.events();

          if(settings.observeChanges) {
            module.observeChanges();
          }
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous instance');
          module.reset();
          if(documentObserver) {
            documentObserver.disconnect();
          }
          if(observer) {
            observer.disconnect();
          }
          $window
            .off('load' + eventNamespace, module.event.load)
            .off('resize' + eventNamespace, module.event.resize)
          ;
          $scroll
            .off('scrollchange' + eventNamespace, module.event.scrollchange)
          ;
          $module.removeData(moduleNamespace);
        },

        observeChanges: function() {
          if('MutationObserver' in window) {
            documentObserver = new MutationObserver(module.event.documentChanged);
            observer         = new MutationObserver(module.event.changed);
            documentObserver.observe(document, {
              childList : true,
              subtree   : true
            });
            observer.observe(element, {
              childList : true,
              subtree   : true
            });
            observer.observe($context[0], {
              childList : true,
              subtree   : true
            });
            module.debug('Setting up mutation observer', observer);
          }
        },

        determineContainer: function() {
          if(settings.container) {
            $container = $(settings.container);
          }
          else {
            $container = $module.offsetParent();
          }
        },

        determineContext: function() {
          if(settings.context) {
            $context = $(settings.context);
          }
          else {
            $context = $container;
          }
          if($context.length === 0) {
            module.error(error.invalidContext, settings.context, $module);
            return;
          }
        },

        checkErrors: function() {
          if( module.is.hidden() ) {
            module.error(error.visible, $module);
          }
          if(module.cache.element.height > module.cache.context.height) {
            module.reset();
            module.error(error.elementSize, $module);
            return;
          }
        },

        bind: {
          events: function() {
            $window
              .on('load' + eventNamespace, module.event.load)
              .on('resize' + eventNamespace, module.event.resize)
            ;
            // pub/sub pattern
            $scroll
              .off('scroll' + eventNamespace)
              .on('scroll' + eventNamespace, module.event.scroll)
              .on('scrollchange' + eventNamespace, module.event.scrollchange)
            ;
          }
        },

        event: {
          changed: function(mutations) {
            clearTimeout(module.timer);
            module.timer = setTimeout(function() {
              module.verbose('DOM tree modified, updating sticky menu', mutations);
              module.refresh();
            }, 100);
          },
          documentChanged: function(mutations) {
            [].forEach.call(mutations, function(mutation) {
              if(mutation.removedNodes) {
                [].forEach.call(mutation.removedNodes, function(node) {
                  if(node == element || $(node).find(element).length > 0) {
                    module.debug('Element removed from DOM, tearing down events');
                    module.destroy();
                  }
                });
              }
            });
          },
          load: function() {
            module.verbose('Page contents finished loading');
            requestAnimationFrame(module.refresh);
          },
          resize: function() {
            module.verbose('Window resized');
            requestAnimationFrame(module.refresh);
          },
          scroll: function() {
            requestAnimationFrame(function() {
              $scroll.triggerHandler('scrollchange' + eventNamespace, $scroll.scrollTop() );
            });
          },
          scrollchange: function(event, scrollPosition) {
            module.stick(scrollPosition);
            settings.onScroll.call(element);
          }
        },

        refresh: function(hardRefresh) {
          module.reset();
          if(!settings.context) {
            module.determineContext();
          }
          if(hardRefresh) {
            module.determineContainer();
          }
          module.save.positions();
          module.stick();
          settings.onReposition.call(element);
        },

        supports: {
          sticky: function() {
            var
              $element = $('<div/>')
            ;
            $element.addClass(className.supported);
            return($element.css('position').match('sticky'));
          }
        },

        save: {
          lastScroll: function(scroll) {
            module.lastScroll = scroll;
          },
          elementScroll: function(scroll) {
            module.elementScroll = scroll;
          },
          positions: function() {
            var
              scrollContext = {
                height : $scroll.height()
              },
              element = {
                margin: {
                  top    : parseInt($module.css('margin-top'), 10),
                  bottom : parseInt($module.css('margin-bottom'), 10),
                },
                offset : $module.offset(),
                width  : $module.outerWidth(),
                height : $module.outerHeight()
              },
              context = {
                offset : $context.offset(),
                height : $context.outerHeight()
              }
            ;
            if( !module.is.standardScroll() ) {
              module.debug('Non-standard scroll. Removing scroll offset from element offset');

              scrollContext.top  = $scroll.scrollTop();
              scrollContext.left = $scroll.scrollLeft();

              element.offset.top  += scrollContext.top;
              context.offset.top  += scrollContext.top;
              element.offset.left += scrollContext.left;
              context.offset.left += scrollContext.left;
            }
            module.cache = {
              fits          : ( (element.height + settings.offset) <= scrollContext.height),
              sameHeight    : (element.height == context.height),
              scrollContext : {
                height : scrollContext.height
              },
              element: {
                margin : element.margin,
                top    : element.offset.top - element.margin.top,
                left   : element.offset.left,
                width  : element.width,
                height : element.height,
                bottom : element.offset.top + element.height
              },
              context: {
                top           : context.offset.top,
                height        : context.height,
                bottom        : context.offset.top + context.height
              }
            };
            module.set.containerSize();

            module.stick();
            module.debug('Caching element positions', module.cache);
          }
        },

        get: {
          direction: function(scroll) {
            var
              direction = 'down'
            ;
            scroll = scroll || $scroll.scrollTop();
            if(module.lastScroll !== undefined) {
              if(module.lastScroll < scroll) {
                direction = 'down';
              }
              else if(module.lastScroll > scroll) {
                direction = 'up';
              }
            }
            return direction;
          },
          scrollChange: function(scroll) {
            scroll = scroll || $scroll.scrollTop();
            return (module.lastScroll)
              ? (scroll - module.lastScroll)
              : 0
            ;
          },
          currentElementScroll: function() {
            if(module.elementScroll) {
              return module.elementScroll;
            }
            return ( module.is.top() )
              ? Math.abs(parseInt($module.css('top'), 10))    || 0
              : Math.abs(parseInt($module.css('bottom'), 10)) || 0
            ;
          },

          elementScroll: function(scroll) {
            scroll = scroll || $scroll.scrollTop();
            var
              element        = module.cache.element,
              scrollContext  = module.cache.scrollContext,
              delta          = module.get.scrollChange(scroll),
              maxScroll      = (element.height - scrollContext.height + settings.offset),
              elementScroll  = module.get.currentElementScroll(),
              possibleScroll = (elementScroll + delta)
            ;
            if(module.cache.fits || possibleScroll < 0) {
              elementScroll = 0;
            }
            else if(possibleScroll > maxScroll ) {
              elementScroll = maxScroll;
            }
            else {
              elementScroll = possibleScroll;
            }
            return elementScroll;
          }
        },

        remove: {
          lastScroll: function() {
            delete module.lastScroll;
          },
          elementScroll: function(scroll) {
            delete module.elementScroll;
          },
          minimumSize: function() {
            $container
              .css('min-height', '')
            ;
          },
          offset: function() {
            $module.css('margin-top', '');
          }
        },

        set: {
          offset: function() {
            module.verbose('Setting offset on element', settings.offset);
            $module
              .css('margin-top', settings.offset)
            ;
          },
          containerSize: function() {
            var
              tagName = $container.get(0).tagName
            ;
            if(tagName === 'HTML' || tagName == 'body') {
              // this can trigger for too many reasons
              //module.error(error.container, tagName, $module);
              module.determineContainer();
            }
            else {
              if( Math.abs($container.outerHeight() - module.cache.context.height) > settings.jitter) {
                module.debug('Context has padding, specifying exact height for container', module.cache.context.height);
                $container.css({
                  height: module.cache.context.height
                });
              }
            }
          },
          minimumSize: function() {
            var
              element   = module.cache.element
            ;
            $container
              .css('min-height', element.height)
            ;
          },
          scroll: function(scroll) {
            module.debug('Setting scroll on element', scroll);
            if(module.elementScroll == scroll) {
              return;
            }
            if( module.is.top() ) {
              $module
                .css('bottom', '')
                .css('top', -scroll)
              ;
            }
            if( module.is.bottom() ) {
              $module
                .css('top', '')
                .css('bottom', scroll)
              ;
            }
          },
          size: function() {
            if(module.cache.element.height !== 0 && module.cache.element.width !== 0) {
              element.style.setProperty('width',  module.cache.element.width  + 'px', 'important');
              element.style.setProperty('height', module.cache.element.height + 'px', 'important');
            }
          }
        },

        is: {
          standardScroll: function() {
            return ($scroll[0] == window);
          },
          top: function() {
            return $module.hasClass(className.top);
          },
          bottom: function() {
            return $module.hasClass(className.bottom);
          },
          initialPosition: function() {
            return (!module.is.fixed() && !module.is.bound());
          },
          hidden: function() {
            return (!$module.is(':visible'));
          },
          bound: function() {
            return $module.hasClass(className.bound);
          },
          fixed: function() {
            return $module.hasClass(className.fixed);
          }
        },

        stick: function(scroll) {
          var
            cachedPosition = scroll || $scroll.scrollTop(),
            cache          = module.cache,
            fits           = cache.fits,
            sameHeight     = cache.sameHeight,
            element        = cache.element,
            scrollContext  = cache.scrollContext,
            context        = cache.context,
            offset         = (module.is.bottom() && settings.pushing)
              ? settings.bottomOffset
              : settings.offset,
            scroll         = {
              top    : cachedPosition + offset,
              bottom : cachedPosition + offset + scrollContext.height
            },
            elementScroll  = (fits)
              ? 0
              : module.get.elementScroll(scroll.top),

            // shorthand
            doesntFit      = !fits,
            elementVisible = (element.height !== 0)
          ;
          if(elementVisible && !sameHeight) {

            if( module.is.initialPosition() ) {
              if(scroll.top >= context.bottom) {
                module.debug('Initial element position is bottom of container');
                module.bindBottom();
              }
              else if(scroll.top > element.top) {
                if( (element.height + scroll.top - elementScroll) >= context.bottom ) {
                  module.debug('Initial element position is bottom of container');
                  module.bindBottom();
                }
                else {
                  module.debug('Initial element position is fixed');
                  module.fixTop();
                }
              }

            }
            else if( module.is.fixed() ) {

              // currently fixed top
              if( module.is.top() ) {
                if( scroll.top <= element.top ) {
                  module.debug('Fixed element reached top of container');
                  module.setInitialPosition();
                }
                else if( (element.height + scroll.top - elementScroll) >= context.bottom ) {
                  module.debug('Fixed element reached bottom of container');
                  module.bindBottom();
                }
                // scroll element if larger than screen
                else if(doesntFit) {
                  module.set.scroll(elementScroll);
                  module.save.lastScroll(scroll.top);
                  module.save.elementScroll(elementScroll);
                }
              }

              // currently fixed bottom
              else if(module.is.bottom() ) {

                // top edge
                if( (scroll.bottom - element.height) <= element.top) {
                  module.debug('Bottom fixed rail has reached top of container');
                  module.setInitialPosition();
                }
                // bottom edge
                else if(scroll.bottom >= context.bottom) {
                  module.debug('Bottom fixed rail has reached bottom of container');
                  module.bindBottom();
                }
                // scroll element if larger than screen
                else if(doesntFit) {
                  module.set.scroll(elementScroll);
                  module.save.lastScroll(scroll.top);
                  module.save.elementScroll(elementScroll);
                }

              }
            }
            else if( module.is.bottom() ) {
              if( scroll.top <= element.top ) {
                module.debug('Jumped from bottom fixed to top fixed, most likely used home/end button');
                module.setInitialPosition();
              }
              else {
                if(settings.pushing) {
                  if(module.is.bound() && scroll.bottom <= context.bottom ) {
                    module.debug('Fixing bottom attached element to bottom of browser.');
                    module.fixBottom();
                  }
                }
                else {
                  if(module.is.bound() && (scroll.top <= context.bottom - element.height) ) {
                    module.debug('Fixing bottom attached element to top of browser.');
                    module.fixTop();
                  }
                }
              }
            }
          }
        },

        bindTop: function() {
          module.debug('Binding element to top of parent container');
          module.remove.offset();
          $module
            .css({
              left         : '',
              top          : '',
              marginBottom : ''
            })
            .removeClass(className.fixed)
            .removeClass(className.bottom)
            .addClass(className.bound)
            .addClass(className.top)
          ;
          settings.onTop.call(element);
          settings.onUnstick.call(element);
        },
        bindBottom: function() {
          module.debug('Binding element to bottom of parent container');
          module.remove.offset();
          $module
            .css({
              left         : '',
              top          : ''
            })
            .removeClass(className.fixed)
            .removeClass(className.top)
            .addClass(className.bound)
            .addClass(className.bottom)
          ;
          settings.onBottom.call(element);
          settings.onUnstick.call(element);
        },

        setInitialPosition: function() {
          module.debug('Returning to initial position');
          module.unfix();
          module.unbind();
        },


        fixTop: function() {
          module.debug('Fixing element to top of page');
          if(settings.setSize) {
            module.set.size();
          }
          module.set.minimumSize();
          module.set.offset();
          $module
            .css({
              left         : module.cache.element.left,
              bottom       : '',
              marginBottom : ''
            })
            .removeClass(className.bound)
            .removeClass(className.bottom)
            .addClass(className.fixed)
            .addClass(className.top)
          ;
          settings.onStick.call(element);
        },

        fixBottom: function() {
          module.debug('Sticking element to bottom of page');
          if(settings.setSize) {
            module.set.size();
          }
          module.set.minimumSize();
          module.set.offset();
          $module
            .css({
              left         : module.cache.element.left,
              bottom       : '',
              marginBottom : ''
            })
            .removeClass(className.bound)
            .removeClass(className.top)
            .addClass(className.fixed)
            .addClass(className.bottom)
          ;
          settings.onStick.call(element);
        },

        unbind: function() {
          if( module.is.bound() ) {
            module.debug('Removing container bound position on element');
            module.remove.offset();
            $module
              .removeClass(className.bound)
              .removeClass(className.top)
              .removeClass(className.bottom)
            ;
          }
        },

        unfix: function() {
          if( module.is.fixed() ) {
            module.debug('Removing fixed position on element');
            module.remove.minimumSize();
            module.remove.offset();
            $module
              .removeClass(className.fixed)
              .removeClass(className.top)
              .removeClass(className.bottom)
            ;
            settings.onUnstick.call(element);
          }
        },

        reset: function() {
          module.debug('Resetting elements position');
          module.unbind();
          module.unfix();
          module.resetCSS();
          module.remove.offset();
          module.remove.lastScroll();
        },

        resetCSS: function() {
          $module
            .css({
              width  : '',
              height : ''
            })
          ;
          $container
            .css({
              height: ''
            })
          ;
        },

        setting: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(!settings.silent && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(!settings.silent && settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          if(!settings.silent) {
            module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
            module.error.apply(console, arguments);
          }
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 0);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if(Array.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.sticky.settings = {

  name           : 'Sticky',
  namespace      : 'sticky',

  silent         : false,
  debug          : false,
  verbose        : true,
  performance    : true,

  // whether to stick in the opposite direction on scroll up
  pushing        : false,

  context        : false,
  container      : false,

  // Context to watch scroll events
  scrollContext  : window,

  // Offset to adjust scroll
  offset         : 0,

  // Offset to adjust scroll when attached to bottom of screen
  bottomOffset   : 0,

  // will only set container height if difference between context and container is larger than this number
  jitter         : 5,

  // set width of sticky element when it is fixed to page (used to make sure 100% width is maintained if no fixed size set)
  setSize        : true,

  // Whether to automatically observe changes with Mutation Observers
  observeChanges : false,

  // Called when position is recalculated
  onReposition   : function(){},

  // Called on each scroll
  onScroll       : function(){},

  // Called when element is stuck to viewport
  onStick        : function(){},

  // Called when element is unstuck from viewport
  onUnstick      : function(){},

  // Called when element reaches top of context
  onTop          : function(){},

  // Called when element reaches bottom of context
  onBottom       : function(){},

  error         : {
    container      : 'Sticky element must be inside a relative container',
    visible        : 'Element is hidden, you must call refresh after element becomes visible. Use silent setting to surpress this warning in production.',
    method         : 'The method you called is not defined.',
    invalidContext : 'Context specified does not exist',
    elementSize    : 'Sticky element is larger than its container, cannot create sticky.'
  },

  className : {
    bound     : 'bound',
    fixed     : 'fixed',
    supported : 'native',
    top       : 'top',
    bottom    : 'bottom'
  }

};

})( jQuery, window, document );

/*!
 * # Fomantic-UI - Tab
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

'use strict';

$.isWindow = $.isWindow || function(obj) {
  return obj != null && obj === obj.window;
};
$.isFunction = $.isFunction || function(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
};

window = (typeof window != 'undefined' && window.Math == Math)
  ? window
  : (typeof self != 'undefined' && self.Math == Math)
    ? self
    : Function('return this')()
;

$.fn.tab = function(parameters) {

  var
    // use window context if none specified
    $allModules     = $.isFunction(this)
        ? $(window)
        : $(this),

    moduleSelector  = $allModules.selector || '',
    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),

    initializedHistory = false,
    returnedValue
  ;

  $allModules
    .each(function() {
      var

        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.tab.settings, parameters)
          : $.extend({}, $.fn.tab.settings),

        className       = settings.className,
        metadata        = settings.metadata,
        selector        = settings.selector,
        error           = settings.error,
        regExp          = settings.regExp,

        eventNamespace  = '.' + settings.namespace,
        moduleNamespace = 'module-' + settings.namespace,

        $module         = $(this),
        $context,
        $tabs,

        cache           = {},
        firstLoad       = true,
        recursionDepth  = 0,
        element         = this,
        instance        = $module.data(moduleNamespace),

        activeTabPath,
        parameterArray,
        module,

        historyEvent

      ;

      module = {

        initialize: function() {
          module.debug('Initializing tab menu item', $module);
          module.fix.callbacks();
          module.determineTabs();

          module.debug('Determining tabs', settings.context, $tabs);
          // set up automatic routing
          if(settings.auto) {
            module.set.auto();
          }
          module.bind.events();

          if(settings.history && !initializedHistory) {
            module.initializeHistory();
            initializedHistory = true;
          }

          if(settings.autoTabActivation && instance === undefined && module.determine.activeTab() == null) {
            module.debug('No active tab detected, setting first tab active', module.get.initialPath());
            module.changeTab(settings.autoTabActivation === true ? module.get.initialPath() : settings.autoTabActivation);
          };

          module.instantiate();
        },

        instantiate: function () {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.debug('Destroying tabs', $module);
          $module
            .removeData(moduleNamespace)
            .off(eventNamespace)
          ;
        },

        bind: {
          events: function() {
            // if using $.tab don't add events
            if( !$.isWindow( element ) ) {
              module.debug('Attaching tab activation events to element', $module);
              $module
                .on('click' + eventNamespace, module.event.click)
              ;
            }
          }
        },

        determineTabs: function() {
          var
            $reference
          ;

          // determine tab context
          if(settings.context === 'parent') {
            if($module.closest(selector.ui).length > 0) {
              $reference = $module.closest(selector.ui);
              module.verbose('Using closest UI element as parent', $reference);
            }
            else {
              $reference = $module;
            }
            $context = $reference.parent();
            module.verbose('Determined parent element for creating context', $context);
          }
          else if(settings.context) {
            $context = $(settings.context);
            module.verbose('Using selector for tab context', settings.context, $context);
          }
          else {
            $context = $('body');
          }
          // find tabs
          if(settings.childrenOnly) {
            $tabs = $context.children(selector.tabs);
            module.debug('Searching tab context children for tabs', $context, $tabs);
          }
          else {
            $tabs = $context.find(selector.tabs);
            module.debug('Searching tab context for tabs', $context, $tabs);
          }
        },

        fix: {
          callbacks: function() {
            if( $.isPlainObject(parameters) && (parameters.onTabLoad || parameters.onTabInit) ) {
              if(parameters.onTabLoad) {
                parameters.onLoad = parameters.onTabLoad;
                delete parameters.onTabLoad;
                module.error(error.legacyLoad, parameters.onLoad);
              }
              if(parameters.onTabInit) {
                parameters.onFirstLoad = parameters.onTabInit;
                delete parameters.onTabInit;
                module.error(error.legacyInit, parameters.onFirstLoad);
              }
              settings = $.extend(true, {}, $.fn.tab.settings, parameters);
            }
          }
        },

        initializeHistory: function() {
          module.debug('Initializing page state');
          if( $.address === undefined ) {
            module.error(error.state);
            return false;
          }
          else {
            if(settings.historyType == 'state') {
              module.debug('Using HTML5 to manage state');
              if(settings.path !== false) {
                $.address
                  .history(true)
                  .state(settings.path)
                ;
              }
              else {
                module.error(error.path);
                return false;
              }
            }
            $.address
              .bind('change', module.event.history.change)
            ;
          }
        },

        event: {
          click: function(event) {
            var
              tabPath = $(this).data(metadata.tab)
            ;
            if(tabPath !== undefined) {
              if(settings.history) {
                module.verbose('Updating page state', event);
                $.address.value(tabPath);
              }
              else {
                module.verbose('Changing tab', event);
                module.changeTab(tabPath);
              }
              event.preventDefault();
            }
            else {
              module.debug('No tab specified');
            }
          },
          history: {
            change: function(event) {
              var
                tabPath   = event.pathNames.join('/') || module.get.initialPath(),
                pageTitle = settings.templates.determineTitle(tabPath) || false
              ;
              module.performance.display();
              module.debug('History change event', tabPath, event);
              historyEvent = event;
              if(tabPath !== undefined) {
                module.changeTab(tabPath);
              }
              if(pageTitle) {
                $.address.title(pageTitle);
              }
            }
          }
        },

        refresh: function() {
          if(activeTabPath) {
            module.debug('Refreshing tab', activeTabPath);
            module.changeTab(activeTabPath);
          }
        },

        cache: {

          read: function(cacheKey) {
            return (cacheKey !== undefined)
              ? cache[cacheKey]
              : false
            ;
          },
          add: function(cacheKey, content) {
            cacheKey = cacheKey || activeTabPath;
            module.debug('Adding cached content for', cacheKey);
            cache[cacheKey] = content;
          },
          remove: function(cacheKey) {
            cacheKey = cacheKey || activeTabPath;
            module.debug('Removing cached content for', cacheKey);
            delete cache[cacheKey];
          }
        },

        escape: {
          string: function(text) {
            text =  String(text);
            return text.replace(regExp.escape, '\\$&');
          }
        },

        set: {
          auto: function() {
            var
              url = (typeof settings.path == 'string')
                ? settings.path.replace(/\/$/, '') + '/{$tab}'
                : '/{$tab}'
            ;
            module.verbose('Setting up automatic tab retrieval from server', url);
            if($.isPlainObject(settings.apiSettings)) {
              settings.apiSettings.url = url;
            }
            else {
              settings.apiSettings = {
                url: url
              };
            }
          },
          loading: function(tabPath) {
            var
              $tab      = module.get.tabElement(tabPath),
              isLoading = $tab.hasClass(className.loading)
            ;
            if(!isLoading) {
              module.verbose('Setting loading state for', $tab);
              $tab
                .addClass(className.loading)
                .siblings($tabs)
                  .removeClass(className.active + ' ' + className.loading)
              ;
              if($tab.length > 0) {
                settings.onRequest.call($tab[0], tabPath);
              }
            }
          },
          state: function(state) {
            $.address.value(state);
          }
        },

        changeTab: function(tabPath) {
          var
            pushStateAvailable = (window.history && window.history.pushState),
            shouldIgnoreLoad   = (pushStateAvailable && settings.ignoreFirstLoad && firstLoad),
            remoteContent      = (settings.auto || $.isPlainObject(settings.apiSettings) ),
            // only add default path if not remote content
            pathArray = (remoteContent && !shouldIgnoreLoad)
              ? module.utilities.pathToArray(tabPath)
              : module.get.defaultPathArray(tabPath)
          ;
          tabPath = module.utilities.arrayToPath(pathArray);
          $.each(pathArray, function(index, tab) {
            var
              currentPathArray   = pathArray.slice(0, index + 1),
              currentPath        = module.utilities.arrayToPath(currentPathArray),

              isTab              = module.is.tab(currentPath),
              isLastIndex        = (index + 1 == pathArray.length),

              $tab               = module.get.tabElement(currentPath),
              $anchor,
              nextPathArray,
              nextPath,
              isLastTab
            ;
            module.verbose('Looking for tab', tab);
            if(isTab) {
              module.verbose('Tab was found', tab);
              // scope up
              activeTabPath  = currentPath;
              parameterArray = module.utilities.filterArray(pathArray, currentPathArray);

              if(isLastIndex) {
                isLastTab = true;
              }
              else {
                nextPathArray = pathArray.slice(0, index + 2);
                nextPath      = module.utilities.arrayToPath(nextPathArray);
                isLastTab     = ( !module.is.tab(nextPath) );
                if(isLastTab) {
                  module.verbose('Tab parameters found', nextPathArray);
                }
              }
              if(isLastTab && remoteContent) {
                if(!shouldIgnoreLoad) {
                  module.activate.navigation(currentPath);
                  module.fetch.content(currentPath, tabPath);
                }
                else {
                  module.debug('Ignoring remote content on first tab load', currentPath);
                  firstLoad = false;
                  module.cache.add(tabPath, $tab.html());
                  module.activate.all(currentPath);
                  settings.onFirstLoad.call($tab[0], currentPath, parameterArray, historyEvent);
                  settings.onLoad.call($tab[0], currentPath, parameterArray, historyEvent);
                }
                return false;
              }
              else {
                module.debug('Opened local tab', currentPath);
                module.activate.all(currentPath);
                if( !module.cache.read(currentPath) ) {
                  module.cache.add(currentPath, true);
                  module.debug('First time tab loaded calling tab init');
                  settings.onFirstLoad.call($tab[0], currentPath, parameterArray, historyEvent);
                }
                settings.onLoad.call($tab[0], currentPath, parameterArray, historyEvent);
              }

            }
            else if(tabPath.search('/') == -1 && tabPath !== '') {
              // look for in page anchor
              tabPath = module.escape.string(tabPath);
              $anchor     = $('#' + tabPath + ', a[name="' + tabPath + '"]');
              currentPath = $anchor.closest('[data-tab]').data(metadata.tab);
              $tab        = module.get.tabElement(currentPath);
              // if anchor exists use parent tab
              if($anchor && $anchor.length > 0 && currentPath) {
                module.debug('Anchor link used, opening parent tab', $tab, $anchor);
                if( !$tab.hasClass(className.active) ) {
                  setTimeout(function() {
                    module.scrollTo($anchor);
                  }, 0);
                }
                module.activate.all(currentPath);
                if( !module.cache.read(currentPath) ) {
                  module.cache.add(currentPath, true);
                  module.debug('First time tab loaded calling tab init');
                  settings.onFirstLoad.call($tab[0], currentPath, parameterArray, historyEvent);
                }
                settings.onLoad.call($tab[0], currentPath, parameterArray, historyEvent);
                return false;
              }
            }
            else {
              module.error(error.missingTab, $module, $context, currentPath);
              return false;
            }
          });
        },

        scrollTo: function($element) {
          var
            scrollOffset = ($element && $element.length > 0)
              ? $element.offset().top
              : false
          ;
          if(scrollOffset !== false) {
            module.debug('Forcing scroll to an in-page link in a hidden tab', scrollOffset, $element);
            $(document).scrollTop(scrollOffset);
          }
        },

        update: {
          content: function(tabPath, html, evaluateScripts) {
            var
              $tab = module.get.tabElement(tabPath),
              tab  = $tab[0]
            ;
            evaluateScripts = (evaluateScripts !== undefined)
              ? evaluateScripts
              : settings.evaluateScripts
            ;
            if(typeof settings.cacheType == 'string' && settings.cacheType.toLowerCase() == 'dom' && typeof html !== 'string') {
              $tab
                .empty()
                .append($(html).clone(true))
              ;
            }
            else {
              if(evaluateScripts) {
                module.debug('Updating HTML and evaluating inline scripts', tabPath, html);
                $tab.html(html);
              }
              else {
                module.debug('Updating HTML', tabPath, html);
                tab.innerHTML = html;
              }
            }
          }
        },

        fetch: {

          content: function(tabPath, fullTabPath) {
            var
              $tab        = module.get.tabElement(tabPath),
              apiSettings = {
                dataType         : 'html',
                encodeParameters : false,
                on               : 'now',
                cache            : settings.alwaysRefresh,
                headers          : {
                  'X-Remote': true
                },
                onSuccess : function(response) {
                  if(settings.cacheType == 'response') {
                    module.cache.add(fullTabPath, response);
                  }
                  module.update.content(tabPath, response);
                  if(tabPath == activeTabPath) {
                    module.debug('Content loaded', tabPath);
                    module.activate.tab(tabPath);
                  }
                  else {
                    module.debug('Content loaded in background', tabPath);
                  }
                  settings.onFirstLoad.call($tab[0], tabPath, parameterArray, historyEvent);
                  settings.onLoad.call($tab[0], tabPath, parameterArray, historyEvent);

                  if(settings.loadOnce) {
                    module.cache.add(fullTabPath, true);
                  }
                  else if(typeof settings.cacheType == 'string' && settings.cacheType.toLowerCase() == 'dom' && $tab.children().length > 0) {
                    setTimeout(function() {
                      var
                        $clone = $tab.children().clone(true)
                      ;
                      $clone = $clone.not('script');
                      module.cache.add(fullTabPath, $clone);
                    }, 0);
                  }
                  else {
                    module.cache.add(fullTabPath, $tab.html());
                  }
                },
                urlData: {
                  tab: fullTabPath
                }
              },
              request         = $tab.api('get request') || false,
              existingRequest = ( request && request.state() === 'pending' ),
              requestSettings,
              cachedContent
            ;

            fullTabPath   = fullTabPath || tabPath;
            cachedContent = module.cache.read(fullTabPath);


            if(settings.cache && cachedContent) {
              module.activate.tab(tabPath);
              module.debug('Adding cached content', fullTabPath);
              if(!settings.loadOnce) {
                if(settings.evaluateScripts == 'once') {
                  module.update.content(tabPath, cachedContent, false);
                }
                else {
                  module.update.content(tabPath, cachedContent);
                }
              }
              settings.onLoad.call($tab[0], tabPath, parameterArray, historyEvent);
            }
            else if(existingRequest) {
              module.set.loading(tabPath);
              module.debug('Content is already loading', fullTabPath);
            }
            else if($.api !== undefined) {
              requestSettings = $.extend(true, {}, settings.apiSettings, apiSettings);
              module.debug('Retrieving remote content', fullTabPath, requestSettings);
              module.set.loading(tabPath);
              $tab.api(requestSettings);
            }
            else {
              module.error(error.api);
            }
          }
        },

        activate: {
          all: function(tabPath) {
            module.activate.tab(tabPath);
            module.activate.navigation(tabPath);
          },
          tab: function(tabPath) {
            var
              $tab          = module.get.tabElement(tabPath),
              $deactiveTabs = (settings.deactivate == 'siblings')
                ? $tab.siblings($tabs)
                : $tabs.not($tab),
              isActive      = $tab.hasClass(className.active)
            ;
            module.verbose('Showing tab content for', $tab);
            if(!isActive) {
              $tab
                .addClass(className.active)
              ;
              $deactiveTabs
                .removeClass(className.active + ' ' + className.loading)
              ;
              if($tab.length > 0) {
                settings.onVisible.call($tab[0], tabPath);
              }
            }
          },
          navigation: function(tabPath) {
            var
              $navigation         = module.get.navElement(tabPath),
              $deactiveNavigation = (settings.deactivate == 'siblings')
                ? $navigation.siblings($allModules)
                : $allModules.not($navigation),
              isActive    = $navigation.hasClass(className.active)
            ;
            module.verbose('Activating tab navigation for', $navigation, tabPath);
            if(!isActive) {
              $navigation
                .addClass(className.active)
              ;
              $deactiveNavigation
                .removeClass(className.active + ' ' + className.loading)
              ;
            }
          }
        },

        deactivate: {
          all: function() {
            module.deactivate.navigation();
            module.deactivate.tabs();
          },
          navigation: function() {
            $allModules
              .removeClass(className.active)
            ;
          },
          tabs: function() {
            $tabs
              .removeClass(className.active + ' ' + className.loading)
            ;
          }
        },

        is: {
          tab: function(tabName) {
            return (tabName !== undefined)
              ? ( module.get.tabElement(tabName).length > 0 )
              : false
            ;
          }
        },

        get: {
          initialPath: function() {
            return $allModules.eq(0).data(metadata.tab) || $tabs.eq(0).data(metadata.tab);
          },
          path: function() {
            return $.address.value();
          },
          // adds default tabs to tab path
          defaultPathArray: function(tabPath) {
            return module.utilities.pathToArray( module.get.defaultPath(tabPath) );
          },
          defaultPath: function(tabPath) {
            var
              $defaultNav = $allModules.filter('[data-' + metadata.tab + '^="' + module.escape.string(tabPath) + '/"]').eq(0),
              defaultTab  = $defaultNav.data(metadata.tab) || false
            ;
            if( defaultTab ) {
              module.debug('Found default tab', defaultTab);
              if(recursionDepth < settings.maxDepth) {
                recursionDepth++;
                return module.get.defaultPath(defaultTab);
              }
              module.error(error.recursion);
            }
            else {
              module.debug('No default tabs found for', tabPath, $tabs);
            }
            recursionDepth = 0;
            return tabPath;
          },
          navElement: function(tabPath) {
            tabPath = tabPath || activeTabPath;
            return $allModules.filter('[data-' + metadata.tab + '="' + module.escape.string(tabPath) + '"]');
          },
          tabElement: function(tabPath) {
            var
              $fullPathTab,
              $simplePathTab,
              tabPathArray,
              lastTab
            ;
            tabPath        = tabPath || activeTabPath;
            tabPathArray   = module.utilities.pathToArray(tabPath);
            lastTab        = module.utilities.last(tabPathArray);
            $fullPathTab   = $tabs.filter('[data-' + metadata.tab + '="' + module.escape.string(tabPath) + '"]');
            $simplePathTab = $tabs.filter('[data-' + metadata.tab + '="' + module.escape.string(lastTab) + '"]');
            return ($fullPathTab.length > 0)
              ? $fullPathTab
              : $simplePathTab
            ;
          },
          tab: function() {
            return activeTabPath;
          }
        },

        determine: {
          activeTab: function() {
            var activeTab = null;

            $tabs.each(function(_index, tab) {
              var $tab = $(tab);

              if( $tab.hasClass(className.active) ) {
                var
                  tabPath = $(this).data(metadata.tab),
                  $anchor = $allModules.filter('[data-' + metadata.tab + '="' + module.escape.string(tabPath) + '"]')
                ;

                if( $anchor.hasClass(className.active) ) {
                  activeTab = tabPath;
                }
              }
            });

            return activeTab;
          }
        },

        utilities: {
          filterArray: function(keepArray, removeArray) {
            return $.grep(keepArray, function(keepValue) {
              return ( $.inArray(keepValue, removeArray) == -1);
            });
          },
          last: function(array) {
            return Array.isArray(array)
              ? array[ array.length - 1]
              : false
            ;
          },
          pathToArray: function(pathName) {
            if(pathName === undefined) {
              pathName = activeTabPath;
            }
            return typeof pathName == 'string'
              ? pathName.split('/')
              : [pathName]
            ;
          },
          arrayToPath: function(pathArray) {
            return Array.isArray(pathArray)
              ? pathArray.join('/')
              : false
            ;
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            if($.isPlainObject(settings[name])) {
              $.extend(true, settings[name], value);
            }
            else {
              settings[name] = value;
            }
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(!settings.silent && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(!settings.silent && settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          if(!settings.silent) {
            module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
            module.error.apply(console, arguments);
          }
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if(Array.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };
      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;
  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;

};

// shortcut for tabbed content with no defined navigation
$.tab = function() {
  $(window).tab.apply(this, arguments);
};

$.fn.tab.settings = {

  name            : 'Tab',
  namespace       : 'tab',

  silent          : false,
  debug           : false,
  verbose         : false,
  performance     : true,

  auto            : false,      // uses pjax style endpoints fetching content from same url with remote-content headers
  history         : false,      // use browser history
  historyType     : 'hash',     // #/ or html5 state
  path            : false,      // base path of url

  context         : false,      // specify a context that tabs must appear inside
  childrenOnly    : false,      // use only tabs that are children of context
  maxDepth        : 25,         // max depth a tab can be nested

  deactivate      : 'siblings', // whether tabs should deactivate sibling menu elements or all elements initialized together

  alwaysRefresh   : false,      // load tab content new every tab click
  cache           : true,       // cache the content requests to pull locally
  loadOnce        : false,      // Whether tab data should only be loaded once when using remote content
  cacheType       : 'response', // Whether to cache exact response, or to html cache contents after scripts execute
  ignoreFirstLoad : false,      // don't load remote content on first load

  apiSettings     : false,      // settings for api call
  evaluateScripts : 'once',     // whether inline scripts should be parsed (true/false/once). Once will not re-evaluate on cached content
  autoTabActivation: true,      // whether a non existing active tab will auto activate the first available tab

  onFirstLoad : function(tabPath, parameterArray, historyEvent) {}, // called first time loaded
  onLoad      : function(tabPath, parameterArray, historyEvent) {}, // called on every load
  onVisible   : function(tabPath, parameterArray, historyEvent) {}, // called every time tab visible
  onRequest   : function(tabPath, parameterArray, historyEvent) {}, // called ever time a tab beings loading remote content

  templates : {
    determineTitle: function(tabArray) {} // returns page title for path
  },

  error: {
    api        : 'You attempted to load content without API module',
    method     : 'The method you called is not defined',
    missingTab : 'Activated tab cannot be found. Tabs are case-sensitive.',
    noContent  : 'The tab you specified is missing a content url.',
    path       : 'History enabled, but no path was specified',
    recursion  : 'Max recursive depth reached',
    legacyInit : 'onTabInit has been renamed to onFirstLoad in 2.0, please adjust your code.',
    legacyLoad : 'onTabLoad has been renamed to onLoad in 2.0. Please adjust your code',
    state      : 'History requires Asual\'s Address library <https://github.com/asual/jquery-address>'
  },

  regExp : {
    escape   : /[-[\]{}()*+?.,\\^$|#\s:=@]/g
  },

  metadata : {
    tab    : 'tab',
    loaded : 'loaded',
    promise: 'promise'
  },

  className   : {
    loading : 'loading',
    active  : 'active'
  },

  selector    : {
    tabs : '.ui.tab',
    ui   : '.ui'
  }

};

})( jQuery, window, document );

/*!
 * # Fomantic-UI - Transition
 * http://github.com/fomantic/Fomantic-UI/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ($, window, document, undefined) {

'use strict';

$.isFunction = $.isFunction || function(obj) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
};

window = (typeof window != 'undefined' && window.Math == Math)
  ? window
  : (typeof self != 'undefined' && self.Math == Math)
    ? self
    : Function('return this')()
;

$.fn.transition = function() {
  var
    $allModules     = $(this),
    moduleSelector  = $allModules.selector || '',

    time            = new Date().getTime(),
    performance     = [],

    moduleArguments = arguments,
    query           = moduleArguments[0],
    queryArguments  = [].slice.call(arguments, 1),
    methodInvoked   = (typeof query === 'string'),

    returnedValue
  ;
  $allModules
    .each(function(index) {
      var
        $module  = $(this),
        element  = this,

        // set at run time
        settings,
        instance,

        error,
        className,
        metadata,
        animationEnd,

        moduleNamespace,
        eventNamespace,
        module
      ;

      module = {

        initialize: function() {

          // get full settings
          settings        = module.get.settings.apply(element, moduleArguments);

          // shorthand
          className       = settings.className;
          error           = settings.error;
          metadata        = settings.metadata;

          // define namespace
          eventNamespace  = '.' + settings.namespace;
          moduleNamespace = 'module-' + settings.namespace;
          instance        = $module.data(moduleNamespace) || module;

          // get vendor specific events
          animationEnd    = module.get.animationEndEvent();

          if(methodInvoked) {
            methodInvoked = module.invoke(query);
          }

          // method not invoked, lets run an animation
          if(methodInvoked === false) {
            module.verbose('Converted arguments into settings object', settings);
            if(settings.interval) {
              module.delay(settings.animate);
            }
            else  {
              module.animate();
            }
            module.instantiate();
          }
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module for', element);
          $module
            .removeData(moduleNamespace)
          ;
        },

        refresh: function() {
          module.verbose('Refreshing display type on next animation');
          delete module.displayType;
        },

        forceRepaint: function() {
          module.verbose('Forcing element repaint');
          var
            $parentElement = $module.parent(),
            $nextElement = $module.next()
          ;
          if($nextElement.length === 0) {
            $module.detach().appendTo($parentElement);
          }
          else {
            $module.detach().insertBefore($nextElement);
          }
        },

        repaint: function() {
          module.verbose('Repainting element');
          var
            fakeAssignment = element.offsetWidth
          ;
        },

        delay: function(interval) {
          var
            direction = module.get.animationDirection(),
            shouldReverse,
            delay
          ;
          if(!direction) {
            direction = module.can.transition()
              ? module.get.direction()
              : 'static'
            ;
          }
          interval = (interval !== undefined)
            ? interval
            : settings.interval
          ;
          shouldReverse = (settings.reverse == 'auto' && direction == className.outward);
          delay = (shouldReverse || settings.reverse == true)
            ? ($allModules.length - index) * settings.interval
            : index * settings.interval
          ;
          module.debug('Delaying animation by', delay);
          setTimeout(module.animate, delay);
        },

        animate: function(overrideSettings) {
          settings = overrideSettings || settings;
          if(!module.is.supported()) {
            module.error(error.support);
            return false;
          }
          module.debug('Preparing animation', settings.animation);
          if(module.is.animating()) {
            if(settings.queue) {
              if(!settings.allowRepeats && module.has.direction() && module.is.occurring() && module.queuing !== true) {
                module.debug('Animation is currently occurring, preventing queueing same animation', settings.animation);
              }
              else {
                module.queue(settings.animation);
              }
              return false;
            }
            else if(!settings.allowRepeats && module.is.occurring()) {
              module.debug('Animation is already occurring, will not execute repeated animation', settings.animation);
              return false;
            }
            else {
              module.debug('New animation started, completing previous early', settings.animation);
              instance.complete();
            }
          }
          if( module.can.animate() ) {
            module.set.animating(settings.animation);
          }
          else {
            module.error(error.noAnimation, settings.animation, element);
          }
        },

        reset: function() {
          module.debug('Resetting animation to beginning conditions');
          module.remove.animationCallbacks();
          module.restore.conditions();
          module.remove.animating();
        },

        queue: function(animation) {
          module.debug('Queueing animation of', animation);
          module.queuing = true;
          $module
            .one(animationEnd + '.queue' + eventNamespace, function() {
              module.queuing = false;
              module.repaint();
              module.animate.apply(this, settings);
            })
          ;
        },

        complete: function (event) {
          if(event && event.target === element) {
              event.stopPropagation();
          }
          module.debug('Animation complete', settings.animation);
          module.remove.completeCallback();
          module.remove.failSafe();
          if(!module.is.looping()) {
            if( module.is.outward() ) {
              module.verbose('Animation is outward, hiding element');
              module.restore.conditions();
              module.hide();
            }
            else if( module.is.inward() ) {
              module.verbose('Animation is outward, showing element');
              module.restore.conditions();
              module.show();
            }
            else {
              module.verbose('Static animation completed');
              module.restore.conditions();
              settings.onComplete.call(element);
            }
          }
        },

        force: {
          visible: function() {
            var
              style          = $module.attr('style'),
              userStyle      = module.get.userStyle(style),
              displayType    = module.get.displayType(),
              overrideStyle  = userStyle + 'display: ' + displayType + ' !important;',
              inlineDisplay  = $module[0].style.display,
              mustStayHidden = !displayType || (inlineDisplay === 'none' && settings.skipInlineHidden) || $module[0].tagName.match(/(script|link|style)/i)
            ;
            if (mustStayHidden){
              module.remove.transition();
              return false;
            }
            module.verbose('Overriding default display to show element', displayType);
            $module
              .attr('style', overrideStyle)
            ;
            return true;
          },
          hidden: function() {
            var
              style          = $module.attr('style'),
              currentDisplay = $module.css('display'),
              emptyStyle     = (style === undefined || style === '')
            ;
            if(currentDisplay !== 'none' && !module.is.hidden()) {
              module.verbose('Overriding default display to hide element');
              $module
                .css('display', 'none')
              ;
            }
            else if(emptyStyle) {
              $module
                .removeAttr('style')
              ;
            }
          }
        },

        has: {
          direction: function(animation) {
            var
              hasDirection = false
            ;
            animation = animation || settings.animation;
            if(typeof animation === 'string') {
              animation = animation.split(' ');
              $.each(animation, function(index, word){
                if(word === className.inward || word === className.outward) {
                  hasDirection = true;
                }
              });
            }
            return hasDirection;
          },
          inlineDisplay: function() {
            var
              style = $module.attr('style') || ''
            ;
            return Array.isArray(style.match(/display.*?;/, ''));
          }
        },

        set: {
          animating: function(animation) {
            // remove previous callbacks
            module.remove.completeCallback();

            // determine exact animation
            animation = animation || settings.animation;
            var animationClass = module.get.animationClass(animation);

              // save animation class in cache to restore class names
            module.save.animation(animationClass);

            if(module.force.visible()) {
              module.remove.hidden();
              module.remove.direction();

              module.start.animation(animationClass);
            }
          },
          duration: function(animationName, duration) {
            duration = duration || settings.duration;
            duration = (typeof duration == 'number')
              ? duration + 'ms'
              : duration
            ;
            if(duration || duration === 0) {
              module.verbose('Setting animation duration', duration);
              $module
                .css({
                  'animation-duration':  duration
                })
              ;
            }
          },
          direction: function(direction) {
            direction = direction || module.get.direction();
            if(direction == className.inward) {
              module.set.inward();
            }
            else {
              module.set.outward();
            }
          },
          looping: function() {
            module.debug('Transition set to loop');
            $module
              .addClass(className.looping)
            ;
          },
          hidden: function() {
            $module
              .addClass(className.transition)
              .addClass(className.hidden)
            ;
          },
          inward: function() {
            module.debug('Setting direction to inward');
            $module
              .removeClass(className.outward)
              .addClass(className.inward)
            ;
          },
          outward: function() {
            module.debug('Setting direction to outward');
            $module
              .removeClass(className.inward)
              .addClass(className.outward)
            ;
          },
          visible: function() {
            $module
              .addClass(className.transition)
              .addClass(className.visible)
            ;
          }
        },

        start: {
          animation: function(animationClass) {
            animationClass = animationClass || module.get.animationClass();
            module.debug('Starting tween', animationClass);
            $module
              .addClass(animationClass)
              .one(animationEnd + '.complete' + eventNamespace, module.complete)
            ;
            if(settings.useFailSafe) {
              module.add.failSafe();
            }
            module.set.duration(settings.duration);
            settings.onStart.call(element);
          }
        },

        save: {
          animation: function(animation) {
            if(!module.cache) {
              module.cache = {};
            }
            module.cache.animation = animation;
          },
          displayType: function(displayType) {
            if(displayType !== 'none') {
              $module.data(metadata.displayType, displayType);
            }
          },
          transitionExists: function(animation, exists) {
            $.fn.transition.exists[animation] = exists;
            module.verbose('Saving existence of transition', animation, exists);
          }
        },

        restore: {
          conditions: function() {
            var
              animation = module.get.currentAnimation()
            ;
            if(animation) {
              $module
                .removeClass(animation)
              ;
              module.verbose('Removing animation class', module.cache);
            }
            module.remove.duration();
          }
        },

        add: {
          failSafe: function() {
            var
              duration = module.get.duration()
            ;
            module.timer = setTimeout(function() {
              $module.triggerHandler(animationEnd);
            }, duration + settings.failSafeDelay);
            module.verbose('Adding fail safe timer', module.timer);
          }
        },

        remove: {
          animating: function() {
            $module.removeClass(className.animating);
          },
          animationCallbacks: function() {
            module.remove.queueCallback();
            module.remove.completeCallback();
          },
          queueCallback: function() {
            $module.off('.queue' + eventNamespace);
          },
          completeCallback: function() {
            $module.off('.complete' + eventNamespace);
          },
          display: function() {
            $module.css('display', '');
          },
          direction: function() {
            $module
              .removeClass(className.inward)
              .removeClass(className.outward)
            ;
          },
          duration: function() {
            $module
              .css('animation-duration', '')
            ;
          },
          failSafe: function() {
            module.verbose('Removing fail safe timer', module.timer);
            if(module.timer) {
              clearTimeout(module.timer);
            }
          },
          hidden: function() {
            $module.removeClass(className.hidden);
          },
          visible: function() {
            $module.removeClass(className.visible);
          },
          looping: function() {
            module.debug('Transitions are no longer looping');
            if( module.is.looping() ) {
              module.reset();
              $module
                .removeClass(className.looping)
              ;
            }
          },
          transition: function() {
            $module
              .removeClass(className.transition)
              .removeClass(className.visible)
              .removeClass(className.hidden)
            ;
          }
        },
        get: {
          settings: function(animation, duration, onComplete) {
            // single settings object
            if(typeof animation == 'object') {
              return $.extend(true, {}, $.fn.transition.settings, animation);
            }
            // all arguments provided
            else if(typeof onComplete == 'function') {
              return $.extend({}, $.fn.transition.settings, {
                animation  : animation,
                onComplete : onComplete,
                duration   : duration
              });
            }
            // only duration provided
            else if(typeof duration == 'string' || typeof duration == 'number') {
              return $.extend({}, $.fn.transition.settings, {
                animation : animation,
                duration  : duration
              });
            }
            // duration is actually settings object
            else if(typeof duration == 'object') {
              return $.extend({}, $.fn.transition.settings, duration, {
                animation : animation
              });
            }
            // duration is actually callback
            else if(typeof duration == 'function') {
              return $.extend({}, $.fn.transition.settings, {
                animation  : animation,
                onComplete : duration
              });
            }
            // only animation provided
            else {
              return $.extend({}, $.fn.transition.settings, {
                animation : animation
              });
            }
          },
          animationClass: function(animation) {
            var
              animationClass = animation || settings.animation,
              directionClass = (module.can.transition() && !module.has.direction())
                ? module.get.direction() + ' '
                : ''
            ;
            return className.animating + ' '
              + className.transition + ' '
              + directionClass
              + animationClass
            ;
          },
          currentAnimation: function() {
            return (module.cache && module.cache.animation !== undefined)
              ? module.cache.animation
              : false
            ;
          },
          currentDirection: function() {
            return module.is.inward()
              ? className.inward
              : className.outward
            ;
          },
          direction: function() {
            return module.is.hidden() || !module.is.visible()
              ? className.inward
              : className.outward
            ;
          },
          animationDirection: function(animation) {
            var
              direction
            ;
            animation = animation || settings.animation;
            if(typeof animation === 'string') {
              animation = animation.split(' ');
              // search animation name for out/in class
              $.each(animation, function(index, word){
                if(word === className.inward) {
                  direction = className.inward;
                }
                else if(word === className.outward) {
                  direction = className.outward;
                }
              });
            }
            // return found direction
            if(direction) {
              return direction;
            }
            return false;
          },
          duration: function(duration) {
            duration = duration || settings.duration;
            if(duration === false) {
              duration = $module.css('animation-duration') || 0;
            }
            return (typeof duration === 'string')
              ? (duration.indexOf('ms') > -1)
                ? parseFloat(duration)
                : parseFloat(duration) * 1000
              : duration
            ;
          },
          displayType: function(shouldDetermine) {
            shouldDetermine = (shouldDetermine !== undefined)
              ? shouldDetermine
              : true
            ;
            if(settings.displayType) {
              return settings.displayType;
            }
            if(shouldDetermine && $module.data(metadata.displayType) === undefined) {
              var currentDisplay = $module.css('display');
              if(currentDisplay === '' || currentDisplay === 'none'){
              // create fake element to determine display state
                module.can.transition(true);
              } else {
                module.save.displayType(currentDisplay);
              }
            }
            return $module.data(metadata.displayType);
          },
          userStyle: function(style) {
            style = style || $module.attr('style') || '';
            return style.replace(/display.*?;/, '');
          },
          transitionExists: function(animation) {
            return $.fn.transition.exists[animation];
          },
          animationStartEvent: function() {
            var
              element     = document.createElement('div'),
              animations  = {
                'animation'       :'animationstart',
                'OAnimation'      :'oAnimationStart',
                'MozAnimation'    :'mozAnimationStart',
                'WebkitAnimation' :'webkitAnimationStart'
              },
              animation
            ;
            for(animation in animations){
              if( element.style[animation] !== undefined ){
                return animations[animation];
              }
            }
            return false;
          },
          animationEndEvent: function() {
            var
              element     = document.createElement('div'),
              animations  = {
                'animation'       :'animationend',
                'OAnimation'      :'oAnimationEnd',
                'MozAnimation'    :'mozAnimationEnd',
                'WebkitAnimation' :'webkitAnimationEnd'
              },
              animation
            ;
            for(animation in animations){
              if( element.style[animation] !== undefined ){
                return animations[animation];
              }
            }
            return false;
          }

        },

        can: {
          transition: function(forced) {
            var
              animation         = settings.animation,
              transitionExists  = module.get.transitionExists(animation),
              displayType       = module.get.displayType(false),
              elementClass,
              tagName,
              $clone,
              currentAnimation,
              inAnimation,
              directionExists
            ;
            if( transitionExists === undefined || forced) {
              module.verbose('Determining whether animation exists');
              elementClass = $module.attr('class');
              tagName      = $module.prop('tagName');

              $clone = $('<' + tagName + ' />').addClass( elementClass ).insertAfter($module);
              currentAnimation = $clone
                .addClass(animation)
                .removeClass(className.inward)
                .removeClass(className.outward)
                .addClass(className.animating)
                .addClass(className.transition)
                .css('animationName')
              ;
              inAnimation = $clone
                .addClass(className.inward)
                .css('animationName')
              ;
              if(!displayType) {
                displayType = $clone
                  .attr('class', elementClass)
                  .removeAttr('style')
                  .removeClass(className.hidden)
                  .removeClass(className.visible)
                  .show()
                  .css('display')
                ;
                module.verbose('Determining final display state', displayType);
                module.save.displayType(displayType);
              }

              $clone.remove();
              if(currentAnimation != inAnimation) {
                module.debug('Direction exists for animation', animation);
                directionExists = true;
              }
              else if(currentAnimation == 'none' || !currentAnimation) {
                module.debug('No animation defined in css', animation);
                return;
              }
              else {
                module.debug('Static animation found', animation, displayType);
                directionExists = false;
              }
              module.save.transitionExists(animation, directionExists);
            }
            return (transitionExists !== undefined)
              ? transitionExists
              : directionExists
            ;
          },
          animate: function() {
            // can transition does not return a value if animation does not exist
            return (module.can.transition() !== undefined);
          }
        },

        is: {
          animating: function() {
            return $module.hasClass(className.animating);
          },
          inward: function() {
            return $module.hasClass(className.inward);
          },
          outward: function() {
            return $module.hasClass(className.outward);
          },
          looping: function() {
            return $module.hasClass(className.looping);
          },
          occurring: function(animation) {
            animation = animation || settings.animation;
            animation = '.' + animation.replace(' ', '.');
            return ( $module.filter(animation).length > 0 );
          },
          visible: function() {
            return $module.is(':visible');
          },
          hidden: function() {
            return $module.css('visibility') === 'hidden';
          },
          supported: function() {
            return(animationEnd !== false);
          }
        },

        hide: function() {
          module.verbose('Hiding element');
          if( module.is.animating() ) {
            module.reset();
          }
          element.blur(); // IE will trigger focus change if element is not blurred before hiding
          module.remove.display();
          module.remove.visible();
          if($.isFunction(settings.onBeforeHide)){
            settings.onBeforeHide.call(element,function(){
                module.hideNow();
            });
          } else {
              module.hideNow();
          }

        },

        hideNow: function() {
            module.set.hidden();
            module.force.hidden();
            settings.onHide.call(element);
            settings.onComplete.call(element);
            // module.repaint();
        },

        show: function(display) {
          module.verbose('Showing element', display);
          if(module.force.visible()) {
            module.remove.hidden();
            module.set.visible();
            settings.onShow.call(element);
            settings.onComplete.call(element);
            // module.repaint();
          }
        },

        toggle: function() {
          if( module.is.visible() ) {
            module.hide();
          }
          else {
            module.show();
          }
        },

        stop: function() {
          module.debug('Stopping current animation');
          $module.triggerHandler(animationEnd);
        },

        stopAll: function() {
          module.debug('Stopping all animation');
          module.remove.queueCallback();
          $module.triggerHandler(animationEnd);
        },

        clear: {
          queue: function() {
            module.debug('Clearing animation queue');
            module.remove.queueCallback();
          }
        },

        enable: function() {
          module.verbose('Starting animation');
          $module.removeClass(className.disabled);
        },

        disable: function() {
          module.debug('Stopping animation');
          $module.addClass(className.disabled);
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            if($.isPlainObject(settings[name])) {
              $.extend(true, settings[name], value);
            }
            else {
              settings[name] = value;
            }
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(!settings.silent && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(!settings.silent && settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          if(!settings.silent) {
            module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
            module.error.apply(console, arguments);
          }
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        // modified for transition to return invoke success
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }

          if(Array.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return (found !== undefined)
            ? found
            : false
          ;
        }
      };
      module.initialize();
    })
  ;
  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

// Records if CSS transition is available
$.fn.transition.exists = {};

$.fn.transition.settings = {

  // module info
  name          : 'Transition',

  // hide all output from this component regardless of other settings
  silent        : false,

  // debug content outputted to console
  debug         : false,

  // verbose debug output
  verbose       : false,

  // performance data output
  performance   : true,

  // event namespace
  namespace     : 'transition',

  // delay between animations in group
  interval      : 0,

  // whether group animations should be reversed
  reverse       : 'auto',

  // animation callback event
  onStart       : function() {},
  onComplete    : function() {},
  onShow        : function() {},
  onHide        : function() {},

  // whether timeout should be used to ensure callback fires in cases animationend does not
  useFailSafe   : true,

  // delay in ms for fail safe
  failSafeDelay : 100,

  // whether EXACT animation can occur twice in a row
  allowRepeats  : false,

  // Override final display type on visible
  displayType   : false,

  // animation duration
  animation     : 'fade',
  duration      : false,

  // new animations will occur after previous ones
  queue         : true,

// whether initially inline hidden objects should be skipped for transition
  skipInlineHidden: false,

  metadata : {
    displayType: 'display'
  },

  className   : {
    animating  : 'animating',
    disabled   : 'disabled',
    hidden     : 'hidden',
    inward     : 'in',
    loading    : 'loading',
    looping    : 'looping',
    outward    : 'out',
    transition : 'transition',
    visible    : 'visible'
  },

  // possible errors
  error: {
    noAnimation : 'Element is no longer attached to DOM. Unable to animate.  Use silent setting to surpress this warning in production.',
    repeated    : 'That animation is already occurring, cancelling repeated animation',
    method      : 'The method you called is not defined',
    support     : 'This browser does not support CSS animations'
  }

};


})( jQuery, window, document );
