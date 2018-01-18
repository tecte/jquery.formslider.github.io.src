(function() {
  var EventManager, Logger,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    slice = [].slice;

  this.DriverFlexslider = (function() {
    DriverFlexslider.config = {
      selector: '.formslider > .slide',
      animation: 'slide',
      animationSpeed: 200,
      smoothHeight: true,
      useCSS: true,
      directionNav: false,
      controlNav: false,
      slideshow: false,
      keyboard: false,
      animationLoop: false
    };

    function DriverFlexslider(container, config1, onBefore, onAfter, onReady) {
      this.container = container;
      this.config = config1;
      this.onBefore = onBefore;
      this.onAfter = onAfter;
      this.onReady = onReady;
      this.moveSlide = bind(this.moveSlide, this);
      this.addSlide = bind(this.addSlide, this);
      this.removeSlide = bind(this.removeSlide, this);
      this._internOnAfter = bind(this._internOnAfter, this);
      this.index = bind(this.index, this);
      this.get = bind(this.get, this);
      this.goto = bind(this.goto, this);
      this.prev = bind(this.prev, this);
      this.next = bind(this.next, this);
      this.config = ObjectExtender.extend({}, DriverFlexslider.config, this.config);
      this.config.after = this._internOnAfter;
      this.config.conditionalBefore = this.onBefore;
      this.config.start = this.onReady;
      this.slides = $(this.config.selector, this.container);
      this.container.flexslider(this.config);
      this.instance = this.container.data('flexslider');
    }

    DriverFlexslider.prototype.next = function() {
      return this.container.flexslider("next");
    };

    DriverFlexslider.prototype.prev = function() {
      return this.container.flexslider("prev");
    };

    DriverFlexslider.prototype.goto = function(indexFromZero) {
      return this.container.flexslider(indexFromZero, true);
    };

    DriverFlexslider.prototype.get = function(indexFromZero) {
      if (indexFromZero === void 0) {
        indexFromZero = this.index();
      }
      return this.slides.get(indexFromZero);
    };

    DriverFlexslider.prototype.index = function() {
      return this.instance.currentSlide;
    };

    DriverFlexslider.prototype._internOnAfter = function(slider) {
      if (slider.lastSlide === slider.currentSlide) {
        return;
      }
      return this.onAfter(slider);
    };

    DriverFlexslider.prototype.removeSlide = function(slide) {
      return this.instance.removeSlide(slide);
    };

    DriverFlexslider.prototype.addSlide = function(slide, position) {
      return this.instance.addSlide(slide, position);
    };

    DriverFlexslider.prototype.moveSlide = function(slide, position) {
      return this.instance.moveSlide(slide, position);
    };

    return DriverFlexslider;

  })();

  this.AbstractFormsliderPlugin = (function() {
    function AbstractFormsliderPlugin(formslider, config) {
      this.formslider = formslider;
      this.slideByIndex = bind(this.slideByIndex, this);
      this.slideById = bind(this.slideById, this);
      this.slideByRole = bind(this.slideByRole, this);
      this.track = bind(this.track, this);
      this.trigger = bind(this.trigger, this);
      this.isCanceled = bind(this.isCanceled, this);
      this.cancel = bind(this.cancel, this);
      this.off = bind(this.off, this);
      this.on = bind(this.on, this);
      this.configWithDataFrom = bind(this.configWithDataFrom, this);
      this.config = ObjectExtender.extend({}, this.constructor.config, config);
      this.container = this.formslider.container;
      this.slides = this.formslider.slides;
      this.events = this.formslider.events;
      this.logger = new Logger("jquery.formslider::" + this.constructor.name);
      this.init();
    }

    AbstractFormsliderPlugin.prototype.init = function() {
      return null;
    };

    AbstractFormsliderPlugin.prototype.configWithDataFrom = function(element) {
      var $element, config, data, key, value;
      config = ObjectExtender.extend({}, this.config);
      $element = $(element);
      for (key in config) {
        value = config[key];
        data = $element.data(key);
        if (data !== void 0) {
          config[key] = data;
        }
      }
      return config;
    };

    AbstractFormsliderPlugin.prototype.on = function(eventName, callback) {
      return this.events.on(eventName + "." + this.constructor.name, callback);
    };

    AbstractFormsliderPlugin.prototype.off = function(eventName) {
      return this.events.off(eventName + "." + this.constructor.name);
    };

    AbstractFormsliderPlugin.prototype.cancel = function(event) {
      return this.events.cancel(event);
    };

    AbstractFormsliderPlugin.prototype.isCanceled = function(event) {
      return this.events.isCanceled(event);
    };

    AbstractFormsliderPlugin.prototype.trigger = function() {
      var ref;
      return (ref = this.events).trigger.apply(ref, arguments);
    };

    AbstractFormsliderPlugin.prototype.track = function(source, value, category) {
      if (category == null) {
        category = null;
      }
      return this.events.trigger('track', source, value, category);
    };

    AbstractFormsliderPlugin.prototype.slideByRole = function(role) {
      return $(".slide-role-" + role, this.container);
    };

    AbstractFormsliderPlugin.prototype.slideById = function(id) {
      return $(".slide-id-" + id, this.container);
    };

    AbstractFormsliderPlugin.prototype.slideByIndex = function(indexFromZero) {
      return this.slides.get(indexFromZero);
    };

    return AbstractFormsliderPlugin;

  })();

  this.AnswerClickPlugin = (function(superClass) {
    extend(AnswerClickPlugin, superClass);

    function AnswerClickPlugin() {
      this.onAnswerClicked = bind(this.onAnswerClicked, this);
      this.init = bind(this.init, this);
      return AnswerClickPlugin.__super__.constructor.apply(this, arguments);
    }

    AnswerClickPlugin.prototype.init = function() {
      var $answers;
      $answers = $(this.config.answerSelector, this.container);
      return $answers.on('mouseup', this.onAnswerClicked);
    };

    AnswerClickPlugin.prototype.onAnswerClicked = function(event) {
      var $allAnswersinRow, $answer, $answerRow;
      event.preventDefault();
      $answer = $(event.currentTarget);
      $answerRow = $answer.closest(this.config.answersSelector);
      $allAnswersinRow = $(this.config.answerSelector, $answerRow);
      $allAnswersinRow.removeClass(this.config.answerSelectedClass);
      $answer.addClass(this.config.answerSelectedClass);
      return this.trigger('question-answered', $answer, $('input', $answer).val(), this.formslider.index());
    };

    return AnswerClickPlugin;

  })(AbstractFormsliderPlugin);

  this.FormSubmissionPlugin = (function(superClass) {
    extend(FormSubmissionPlugin, superClass);

    function FormSubmissionPlugin() {
      this.onFail = bind(this.onFail, this);
      this.onDone = bind(this.onDone, this);
      this.onSubmit = bind(this.onSubmit, this);
      this.init = bind(this.init, this);
      return FormSubmissionPlugin.__super__.constructor.apply(this, arguments);
    }

    FormSubmissionPlugin.config = {
      submitOnEvents: ['validation.valid.contact'],
      successEventName: 'form-submitted',
      errorEventName: 'form-submission-error',
      loadHiddenFrameOnSuccess: null,
      formSelector: 'form',
      submitter: {
        "class": 'FormSubmitterCollect',
        endpoint: '#',
        method: 'POST'
      }
    };

    FormSubmissionPlugin.prototype.init = function() {
      var SubmitterClass, eventName, j, len, ref;
      this.form = $(this.config.formSelector);
      ref = this.config.submitOnEvents;
      for (j = 0, len = ref.length; j < len; j++) {
        eventName = ref[j];
        this.on(eventName, this.onSubmit);
      }
      SubmitterClass = window[this.config.submitter["class"]];
      return this.submitter = new SubmitterClass(this, this.config.submitter, this.form);
    };

    FormSubmissionPlugin.prototype.onSubmit = function(event, currentSlide) {
      if (this.isCanceled(event)) {
        return;
      }
      return this.submitter.submit(event, currentSlide);
    };

    FormSubmissionPlugin.prototype.onDone = function() {
      this.trigger(this.config.successEventName);
      this.loadHiddenFrameOnSuccess();
      return this.logger.debug('onDone');
    };

    FormSubmissionPlugin.prototype.onFail = function() {
      this.logger.error('onFail', this.config.errorEventName);
      return this.trigger(this.config.errorEventName);
    };

    FormSubmissionPlugin.prototype.loadHiddenFrameOnSuccess = function(url) {
      if (this.config.loadHiddenFrameOnSuccess == null) {
        return;
      }
      return $('<iframe>', {
        src: this.config.loadHiddenFrameOnSuccess,
        id: 'formslider_conversion_frame',
        frameborder: 0,
        scrolling: 'no'
      }).css({
        width: 0,
        height: 0
      }).appendTo('body');
    };

    return FormSubmissionPlugin;

  })(AbstractFormsliderPlugin);

  this.FormSubmitterAbstract = (function() {
    function FormSubmitterAbstract(plugin1, config1, form) {
      this.plugin = plugin1;
      this.config = config1;
      this.form = form;
      this.supressNaturalFormSubmit = bind(this.supressNaturalFormSubmit, this);
    }

    FormSubmitterAbstract.prototype.supressNaturalFormSubmit = function() {
      return this.form.submit(function(e) {
        e.preventDefault();
        return false;
      });
    };

    return FormSubmitterAbstract;

  })();

  this.FormSubmitterAjax = (function(superClass) {
    extend(FormSubmitterAjax, superClass);

    function FormSubmitterAjax(plugin1, config1, form) {
      this.plugin = plugin1;
      this.config = config1;
      this.form = form;
      this.submit = bind(this.submit, this);
      FormSubmitterAjax.__super__.constructor.call(this, this.plugin, this.config, this.form);
      this.supressNaturalFormSubmit();
    }

    FormSubmitterAjax.prototype.submit = function(event, slide) {
      this.form.ajaxSubmit(this.config);
      return this.form.data('jqxhr').done(this.plugin.onDone).fail(this.plugin.onFail);
    };

    return FormSubmitterAjax;

  })(FormSubmitterAbstract);

  this.FormSubmitterCollect = (function(superClass) {
    extend(FormSubmitterCollect, superClass);

    function FormSubmitterCollect(plugin1, config1, form) {
      this.plugin = plugin1;
      this.config = config1;
      this.form = form;
      this.collectInputs = bind(this.collectInputs, this);
      this.submit = bind(this.submit, this);
      FormSubmitterCollect.__super__.constructor.call(this, this.plugin, this.config, this.form);
      this.supressNaturalFormSubmit();
    }

    FormSubmitterCollect.prototype.submit = function(event, slide) {
      return $.ajax({
        cache: false,
        url: this.config.endpoint,
        method: this.config.method,
        data: this.collectInputs()
      }).done(this.plugin.onDone).fail(this.plugin.onFail);
    };

    FormSubmitterCollect.prototype.collectInputs = function() {
      var $input, $inputs, $other, $others, input, j, k, len, len1, other, result;
      result = {};
      $inputs = $('input', this.plugin.container);
      for (j = 0, len = $inputs.length; j < len; j++) {
        input = $inputs[j];
        $input = $(input);
        if ($input.is(':checkbox') || $input.is(':radio')) {
          if ($input.is(':checked')) {
            result[$input.attr('name')] = $input.val();
          }
        } else {
          result[$input.attr('name')] = $input.val();
        }
      }
      $others = $('select, textarea', this.plugin.container);
      for (k = 0, len1 = $others.length; k < len1; k++) {
        other = $others[k];
        $other = $(other);
        result[$other.attr('name')] = $other.val();
      }
      return result;
    };

    return FormSubmitterCollect;

  })(FormSubmitterAbstract);

  this.FormSubmitterSubmit = (function(superClass) {
    extend(FormSubmitterSubmit, superClass);

    function FormSubmitterSubmit() {
      return FormSubmitterSubmit.__super__.constructor.apply(this, arguments);
    }

    FormSubmitterSubmit.prototype.submit = function(event, slide) {};

    return FormSubmitterSubmit;

  })(FormSubmitterAbstract);

  this.InputFocusPlugin = (function(superClass) {
    extend(InputFocusPlugin, superClass);

    function InputFocusPlugin() {
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return InputFocusPlugin.__super__.constructor.apply(this, arguments);
    }

    InputFocusPlugin.config = {
      selector: 'input:visible',
      waitBeforeFocus: 200,
      disableOnMobile: true
    };

    InputFocusPlugin.prototype.init = function() {
      return this.on('after', this.onAfter);
    };

    InputFocusPlugin.prototype.onAfter = function(e, currentSlide, direction, prevSlide) {
      var $input;
      if (this.config.disableOnMobile && FeatureDetector.isMobileDevice()) {
        return;
      }
      $input = $(this.config.selector, currentSlide);
      if (!$input.length) {
        if (indexOf.call(document, "activeElement") >= 0) {
          document.activeElement.blur();
        }
        return;
      }
      return setTimeout(function() {
        return $input.first().focus();
      }, this.config.waitBeforeFocus);
    };

    return InputFocusPlugin;

  })(AbstractFormsliderPlugin);

  this.InputSyncPlugin = (function(superClass) {
    extend(InputSyncPlugin, superClass);

    function InputSyncPlugin() {
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return InputSyncPlugin.__super__.constructor.apply(this, arguments);
    }

    InputSyncPlugin.config = {
      selector: 'input',
      attribute: 'name'
    };

    InputSyncPlugin.prototype.init = function() {
      this.storage = {};
      return this.on('after', this.onAfter);
    };

    InputSyncPlugin.prototype.onAfter = function(event, currentSlide, direction, prevSlide) {
      var $inputsHere, $inputsThere;
      $inputsHere = $(this.config.selector, prevSlide);
      $inputsHere.each((function(_this) {
        return function(index, input) {
          var $input;
          $input = $(input);
          return _this.storage[$input.attr(_this.config.attribute)] = $input.val();
        };
      })(this));
      $inputsThere = $(this.config.selector, currentSlide);
      return $inputsThere.each((function(_this) {
        return function(index, input) {
          var $input, inputName;
          $input = $(input);
          inputName = $input.attr(_this.config.attribute);
          if (_this.storage[inputName]) {
            return $input.val(_this.storage[inputName]);
          }
        };
      })(this));
    };

    return InputSyncPlugin;

  })(AbstractFormsliderPlugin);

  this.JqueryValidatePlugin = (function(superClass) {
    extend(JqueryValidatePlugin, superClass);

    function JqueryValidatePlugin() {
      this.prepareInputs = bind(this.prepareInputs, this);
      this.onValidate = bind(this.onValidate, this);
      this.init = bind(this.init, this);
      return JqueryValidatePlugin.__super__.constructor.apply(this, arguments);
    }

    JqueryValidatePlugin.config = {
      selector: 'input:visible',
      validateOnEvents: ['leaving.next'],
      forceMaxLengthJs: "javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);",
      messages: {
        required: 'Required',
        maxlength: 'To long',
        minlength: 'To short',
        email: 'Enter valid E-Mail'
      }
    };

    JqueryValidatePlugin.prototype.init = function() {
      var eventName, j, len, ref;
      ref = this.config.validateOnEvents;
      for (j = 0, len = ref.length; j < len; j++) {
        eventName = ref[j];
        this.on(eventName, this.onValidate);
      }
      this.prepareInputs();
      return this.trigger("validation.prepared");
    };

    JqueryValidatePlugin.prototype.onValidate = function(event, currentSlide, direction, nextSlide) {
      var $inputs, currentRole;
      $inputs = $(this.config.selector, currentSlide);
      if (!$inputs.length) {
        return;
      }
      currentRole = $(currentSlide).data('role');
      if (!$inputs.valid()) {
        $inputs.filter('.error').first().focus();
        this.trigger("validation.invalid." + currentRole, currentSlide);
        event.canceled = true;
        return false;
      }
      return this.trigger("validation.valid." + currentRole, currentSlide);
    };

    JqueryValidatePlugin.prototype.prepareInputs = function() {
      return $(this.config.selector, this.container).each((function(_this) {
        return function(index, input) {
          var $input, attribute, j, len, ref;
          $input = $(input);
          if ($input.attr('required')) {
            $input.data('data-rule-required', 'true');
            $input.data('data-msg-required', _this.config.messages.required);
          }
          if ($input.data('type') === 'number') {
            $input.attr('pattern', '\\d*');
            $input.attr('inputmode', 'numeric');
          }
          if ($input.data('without-spinner')) {
            $input.addClass('without-spinner');
          }
          ref = ['maxlength', 'minlength'];
          for (j = 0, len = ref.length; j < len; j++) {
            attribute = ref[j];
            if ($input.attr(attribute)) {
              $input.data("data-rule-" + attribute, $input.attr(attribute));
              $input.data("data-msg-" + attribute, _this.config.messages[attribute]);
            }
          }
          if ($input.data('force-max-length')) {
            $input.attr('oninput', _this.config.forceMaxLengthJs);
          }
          if ($input.attr('type') === 'email') {
            return $input.data('data-msg-email', _this.config.messages.email);
          }
        };
      })(this));
    };

    return JqueryValidatePlugin;

  })(AbstractFormsliderPlugin);

  this.NormalizeInputAttributesPlugin = (function(superClass) {
    extend(NormalizeInputAttributesPlugin, superClass);

    function NormalizeInputAttributesPlugin() {
      this.prepareInputs = bind(this.prepareInputs, this);
      this.init = bind(this.init, this);
      return NormalizeInputAttributesPlugin.__super__.constructor.apply(this, arguments);
    }

    NormalizeInputAttributesPlugin.config = {
      selector: 'input:visible'
    };

    NormalizeInputAttributesPlugin.prototype.init = function() {
      return this.prepareInputs();
    };

    NormalizeInputAttributesPlugin.prototype.prepareInputs = function() {
      return $(this.config.selector, this.container).each(function(index, input) {
        var $input, attribute, j, len, ref, results;
        $input = $(input);
        if ($input.attr('required')) {
          $input.data('required', 'required');
          $input.data('aria-required', 'true');
        }
        ref = ['inputmode', 'autocompletetype'];
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          attribute = ref[j];
          if ($input.attr(attribute)) {
            results.push($input.data("x-" + attribute, $input.attr(attribute)));
          } else {
            results.push(void 0);
          }
        }
        return results;
      });
    };

    return NormalizeInputAttributesPlugin;

  })(AbstractFormsliderPlugin);

  this.TabIndexSetterPlugin = (function(superClass) {
    extend(TabIndexSetterPlugin, superClass);

    function TabIndexSetterPlugin() {
      this.disableTabs = bind(this.disableTabs, this);
      this.enableTabs = bind(this.enableTabs, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return TabIndexSetterPlugin.__super__.constructor.apply(this, arguments);
    }

    TabIndexSetterPlugin.config = {
      selector: 'input:visible, a, select, textarea, button'
    };

    TabIndexSetterPlugin.prototype.init = function() {
      this.disableTabs();
      this.enableTabs(this.slideByIndex(0));
      return this.on('after', this.onAfter);
    };

    TabIndexSetterPlugin.prototype.onAfter = function(event, currentSlide, direction, prevSlide) {
      this.disableTabs();
      return this.enableTabs(currentSlide);
    };

    TabIndexSetterPlugin.prototype.enableTabs = function(slide) {
      return $(this.config.selector, slide).attr('tabindex', 0);
    };

    TabIndexSetterPlugin.prototype.disableTabs = function() {
      return $(this.config.selector, this.container).attr('tabindex', '-1');
    };

    return TabIndexSetterPlugin;

  })(AbstractFormsliderPlugin);

  this.AddSlideClassesPlugin = (function(superClass) {
    extend(AddSlideClassesPlugin, superClass);

    function AddSlideClassesPlugin() {
      this._addAnswerCountClasses = bind(this._addAnswerCountClasses, this);
      this._doWithSlide = bind(this._doWithSlide, this);
      this.init = bind(this.init, this);
      return AddSlideClassesPlugin.__super__.constructor.apply(this, arguments);
    }

    AddSlideClassesPlugin.prototype.init = function() {
      return this.slides.each(this._doWithSlide);
    };

    AddSlideClassesPlugin.prototype._doWithSlide = function(index, slide) {
      var $slide;
      $slide = $(slide);
      this._addAnswerCountClasses(index, $slide);
      this._addSlideNumberClass(index, $slide);
      this._addRoleClass($slide);
      return this._addSlideIdClass($slide);
    };

    AddSlideClassesPlugin.prototype._addAnswerCountClasses = function(index, $slide) {
      var answerCount;
      answerCount = $(this.config.answerSelector, $slide).length;
      return $slide.addClass("answer-count-" + answerCount).data('answer-count', answerCount);
    };

    AddSlideClassesPlugin.prototype._addRoleClass = function($slide) {
      var role;
      role = $slide.data('role');
      return $slide.addClass("slide-role-" + role);
    };

    AddSlideClassesPlugin.prototype._addSlideNumberClass = function(index, $slide) {
      return $slide.addClass("slide-number-" + index).data('slide-number', index);
    };

    AddSlideClassesPlugin.prototype._addSlideIdClass = function($slide) {
      var id;
      id = $slide.data('id');
      if (id === void 0) {
        id = $slide.data('role');
      }
      return $slide.addClass("slide-id-" + id);
    };

    return AddSlideClassesPlugin;

  })(AbstractFormsliderPlugin);

  this.DoOnEventPlugin = (function(superClass) {
    extend(DoOnEventPlugin, superClass);

    function DoOnEventPlugin() {
      this.init = bind(this.init, this);
      return DoOnEventPlugin.__super__.constructor.apply(this, arguments);
    }

    DoOnEventPlugin.prototype.init = function() {
      return $.each(this.config, (function(_this) {
        return function(eventName, callback) {
          if (typeof callback === 'function') {
            return _this.on(eventName, function() {
              return callback(_this);
            });
          }
        };
      })(this));
    };

    return DoOnEventPlugin;

  })(AbstractFormsliderPlugin);

  this.DoOneTimeOnEventPlugin = (function(superClass) {
    extend(DoOneTimeOnEventPlugin, superClass);

    function DoOneTimeOnEventPlugin() {
      this.init = bind(this.init, this);
      return DoOneTimeOnEventPlugin.__super__.constructor.apply(this, arguments);
    }

    DoOneTimeOnEventPlugin.prototype.init = function() {
      return $.each(this.config, (function(_this) {
        return function(eventName, callback) {
          if (typeof callback === 'function') {
            return _this.on(eventName, function() {
              _this.off(eventName);
              return callback(_this);
            });
          }
        };
      })(this));
    };

    return DoOneTimeOnEventPlugin;

  })(AbstractFormsliderPlugin);

  this.ArrowNavigationPlugin = (function(superClass) {
    extend(ArrowNavigationPlugin, superClass);

    function ArrowNavigationPlugin() {
      this.onKeyPressed = bind(this.onKeyPressed, this);
      this.init = bind(this.init, this);
      return ArrowNavigationPlugin.__super__.constructor.apply(this, arguments);
    }

    ArrowNavigationPlugin.config = {
      selector: document,
      keyCodeLeft: 37,
      keyCodeRight: 39
    };

    ArrowNavigationPlugin.prototype.init = function() {
      var $trigger;
      $trigger = $(this.config.selector);
      return $trigger.keydown(this.onKeyPressed);
    };

    ArrowNavigationPlugin.prototype.onKeyPressed = function(event) {
      var keyCode;
      keyCode = event.keyCode || event.which;
      switch (keyCode) {
        case this.config.keyCodeLeft:
          return this.formslider.prev();
        case this.config.keyCodeRight:
          return this.formslider.next();
      }
    };

    return ArrowNavigationPlugin;

  })(AbstractFormsliderPlugin);

  this.BrowserHistoryPlugin = (function(superClass) {
    extend(BrowserHistoryPlugin, superClass);

    function BrowserHistoryPlugin() {
      this.handleHistoryChange = bind(this.handleHistoryChange, this);
      this.pushCurrentHistoryState = bind(this.pushCurrentHistoryState, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return BrowserHistoryPlugin.__super__.constructor.apply(this, arguments);
    }

    BrowserHistoryPlugin.config = {
      updateHash: true
    };

    BrowserHistoryPlugin.prototype.init = function() {
      this.on('after', this.onAfter);
      this.dontUpdateHistoryNow = false;
      this.pushCurrentHistoryState();
      return $(window).bind('popstate', this.handleHistoryChange);
    };

    BrowserHistoryPlugin.prototype.onAfter = function() {
      if (this.dontUpdateHistoryNow) {
        this.dontUpdateHistoryNow = false;
        return;
      }
      return this.pushCurrentHistoryState();
    };

    BrowserHistoryPlugin.prototype.pushCurrentHistoryState = function() {
      var hash;
      hash = null;
      if (this.config.updateHash) {
        hash = "#" + (this.formslider.index());
      }
      this.logger.debug('pushCurrentHistoryState', hash);
      return history.pushState({
        index: this.formslider.index()
      }, "index " + (this.formslider.index()), hash);
    };

    BrowserHistoryPlugin.prototype.handleHistoryChange = function(event) {
      var newIndex, ref;
      if (((ref = event.originalEvent) != null ? ref.state : void 0) == null) {
        return;
      }
      newIndex = event.originalEvent.state.index;
      this.logger.debug('handleHistoryChange', newIndex);
      this.dontUpdateHistoryNow = true;
      return this.formslider.goto(newIndex);
    };

    return BrowserHistoryPlugin;

  })(AbstractFormsliderPlugin);

  this.NextOnClickPlugin = (function(superClass) {
    extend(NextOnClickPlugin, superClass);

    function NextOnClickPlugin() {
      this.onClick = bind(this.onClick, this);
      this.init = bind(this.init, this);
      return NextOnClickPlugin.__super__.constructor.apply(this, arguments);
    }

    NextOnClickPlugin.config = {
      selector: '.next-button, .answer',
      waitAfterClick: 10
    };

    NextOnClickPlugin.prototype.init = function() {
      var $buttons;
      $buttons = $(this.config.selector, this.container);
      return $buttons.on('mouseup', this.onClick);
    };

    NextOnClickPlugin.prototype.onClick = function(event) {
      event.preventDefault();
      if (!this.timeout) {
        return this.timeout = setTimeout((function(_this) {
          return function() {
            _this.formslider.next();
            return _this.timeout = null;
          };
        })(this), this.config.waitAfterClick);
      }
    };

    return NextOnClickPlugin;

  })(AbstractFormsliderPlugin);

  this.NextOnKeyPlugin = (function(superClass) {
    extend(NextOnKeyPlugin, superClass);

    function NextOnKeyPlugin() {
      this.onKeyPressed = bind(this.onKeyPressed, this);
      this.init = bind(this.init, this);
      return NextOnKeyPlugin.__super__.constructor.apply(this, arguments);
    }

    NextOnKeyPlugin.config = {
      selector: 'input',
      keyCode: 13
    };

    NextOnKeyPlugin.prototype.init = function() {
      var $inputs;
      $inputs = $(this.config.selector, this.container);
      return $inputs.keypress(this.onKeyPressed);
    };

    NextOnKeyPlugin.prototype.onKeyPressed = function(event) {
      var keyCode;
      keyCode = event.keyCode || event.which;
      if (keyCode === this.config.keyCode) {
        return this.formslider.next();
      }
    };

    return NextOnKeyPlugin;

  })(AbstractFormsliderPlugin);

  this.NextSlideResolverPlugin = (function(superClass) {
    extend(NextSlideResolverPlugin, superClass);

    function NextSlideResolverPlugin() {
      this.onResolve = bind(this.onResolve, this);
      this.makeToNextSlide = bind(this.makeToNextSlide, this);
      this.onQuestionAnswered = bind(this.onQuestionAnswered, this);
      this.onReady = bind(this.onReady, this);
      this.init = bind(this.init, this);
      return NextSlideResolverPlugin.__super__.constructor.apply(this, arguments);
    }

    NextSlideResolverPlugin.prototype.init = function() {
      this.on('ready', this.onReady);
      return this.on('before-driver-next', this.onResolve);
    };

    NextSlideResolverPlugin.prototype.onReady = function(event) {
      return this.slides.each((function(_this) {
        return function(index, slide) {
          var $slide, slideBefore;
          $slide = $(slide);
          slideBefore = _this.slides.get(index - 1);
          if (slideBefore && $(slideBefore).data('next-id') === void 0) {
            return $(slideBefore).data('next-id', $slide.data('id')).addClass("next-id-" + ($slide.data('id')));
          }
        };
      })(this));
    };

    NextSlideResolverPlugin.prototype.onQuestionAnswered = function(event, $answer, value, slideIndex) {
      var answerNextId, currentSlide, nextId;
      currentSlide = this.slideByIndex(slideIndex);
      answerNextId = $answer.data('next-id');
      nextId = $(currentSlide).data('next-id');
      if (answerNextId !== void 0) {
        nextId = answerNextId;
      }
      return this.makeToNextSlide(nextId, slideIndex + 1, currentSlide);
    };

    NextSlideResolverPlugin.prototype.makeToNextSlide = function(nextId, insertAtIndex, currentSlide) {
      var nextSlide;
      nextSlide = this.slideById(nextId);
      this.formslider.driver.moveSlide(nextSlide, insertAtIndex);
      return this.trigger('next-slide-changed', nextSlide);
    };

    NextSlideResolverPlugin.prototype.onResolve = function(event) {
      var currentSlide, nextId, nextIdFromAnswer, nextSlide, selectedAnswer;
      currentSlide = this.formslider.driver.get(this.formslider.index());
      nextId = $(currentSlide).data('next-id');
      selectedAnswer = $("." + this.config.answerSelectedClass, currentSlide);
      if (selectedAnswer.length) {
        nextIdFromAnswer = selectedAnswer.data('next-id');
        if (nextIdFromAnswer !== void 0) {
          nextId = nextIdFromAnswer;
        }
      }
      if (nextId !== void 0) {
        nextSlide = this.slideById(nextId);
        this.makeToNextSlide(nextId, $(currentSlide).index() + 1, currentSlide);
        return this.trigger('next-slide-changed', nextSlide);
      }
    };

    return NextSlideResolverPlugin;

  })(AbstractFormsliderPlugin);

  this.ProgressBarPlugin = (function(superClass) {
    extend(ProgressBarPlugin, superClass);

    function ProgressBarPlugin() {
      this.show = bind(this.show, this);
      this.hide = bind(this.hide, this);
      this._setSteps = bind(this._setSteps, this);
      this._setPercentStepCallback = bind(this._setPercentStepCallback, this);
      this._setPercent = bind(this._setPercent, this);
      this.set = bind(this.set, this);
      this.shouldBeVisible = bind(this.shouldBeVisible, this);
      this.doUpdate = bind(this.doUpdate, this);
      this.slidesThatCount = bind(this.slidesThatCount, this);
      this.init = bind(this.init, this);
      return ProgressBarPlugin.__super__.constructor.apply(this, arguments);
    }

    ProgressBarPlugin.config = {
      selectorWrapper: '.progressbar-wrapper',
      selectorText: '.progress-text',
      selectorProgress: '.progress',
      animationSpeed: 300,
      type: 'percent',
      initialProgress: '15',
      dontCountOnRoles: ['loader', 'contact', 'confirmation'],
      hideOnRoles: ['zipcode', 'loader', 'contact', 'confirmation']
    };

    ProgressBarPlugin.prototype.init = function() {
      this.on('after', this.doUpdate);
      this.visible = true;
      this.wrapper = $(this.config.selectorWrapper);
      this.config = this.configWithDataFrom(this.wrapper);
      this.progress = $(this.config.selectorText, this.wrapper);
      this.bar = $(this.config.selectorProgress, this.wrapper);
      this.type = this.config.type;
      this.bar.css('transition-duration', (this.config.animationSpeed / 1000) + 's');
      this.countMax = this.slidesThatCount();
      return this.set(0);
    };

    ProgressBarPlugin.prototype.slidesThatCount = function() {
      var j, len, ref, role, substract;
      substract = 0;
      ref = this.config.dontCountOnRoles;
      for (j = 0, len = ref.length; j < len; j++) {
        role = ref[j];
        substract = substract + this.slideByRole(role).length;
      }
      return this.slides.length - substract;
    };

    ProgressBarPlugin.prototype.doUpdate = function(e, current, direction, next) {
      var index;
      index = this.formslider.index();
      if (!this.shouldBeVisible(current)) {
        this.set(index);
        return this.hide();
      }
      this.show();
      return this.set(index);
    };

    ProgressBarPlugin.prototype.shouldBeVisible = function(slide) {
      var ref;
      return !(ref = $(slide).data('role'), indexOf.call(this.config.hideOnRoles, ref) >= 0);
    };

    ProgressBarPlugin.prototype.set = function(indexFromZero) {
      var indexFromOne, percent;
      if (indexFromZero > this.countMax) {
        indexFromZero = this.countMax;
      }
      if (indexFromZero < 0) {
        indexFromZero = 0;
      }
      indexFromOne = indexFromZero + 1;
      percent = (indexFromOne / this.countMax) * 100;
      this.bar.css('width', percent + '%');
      if (this.config.type === 'steps') {
        this._setSteps(indexFromOne);
        return;
      }
      if ((this.config.initialProgress != null) && indexFromZero < 1) {
        percent = Math.max(this.config.initialProgress, percent);
      }
      return this._setPercent(percent);
    };

    ProgressBarPlugin.prototype._setPercent = function(percent) {
      var startFrom;
      startFrom = parseInt(this.progress.text()) || 13;
      return $({
        Counter: startFrom
      }).animate({
        Counter: percent
      }, {
        duration: this.config.animationSpeed,
        queue: false,
        easing: 'swing',
        step: this._setPercentStepCallback
      });
    };

    ProgressBarPlugin.prototype._setPercentStepCallback = function(percent) {
      return this.progress.text(Math.ceil(percent) + '%');
    };

    ProgressBarPlugin.prototype._setSteps = function(indexFromOne) {
      return this.progress.text(indexFromOne + "/" + this.countMax);
    };

    ProgressBarPlugin.prototype.hide = function() {
      if (!this.visible) {
        return;
      }
      this.wrapper.animate({
        opacity: 0
      }, this.config.animationSpeed);
      return this.visible = false;
    };

    ProgressBarPlugin.prototype.show = function() {
      if (this.visible) {
        return;
      }
      this.wrapper.animate({
        opacity: 1
      }, this.config.animationSpeed);
      return this.visible = true;
    };

    return ProgressBarPlugin;

  })(AbstractFormsliderPlugin);

  this.ConfirmationSlidePlugin = (function(superClass) {
    extend(ConfirmationSlidePlugin, superClass);

    function ConfirmationSlidePlugin() {
      this.onLeaving = bind(this.onLeaving, this);
      this.init = bind(this.init, this);
      return ConfirmationSlidePlugin.__super__.constructor.apply(this, arguments);
    }

    ConfirmationSlidePlugin.prototype.init = function() {
      return this.on('leaving.confirmation', this.onLeaving);
    };

    ConfirmationSlidePlugin.prototype.onLeaving = function(event, current, direction, next) {
      return this.cancel(event);
    };

    return ConfirmationSlidePlugin;

  })(AbstractFormsliderPlugin);

  this.ContactSlidePlugin = (function(superClass) {
    extend(ContactSlidePlugin, superClass);

    function ContactSlidePlugin() {
      this.onLeaving = bind(this.onLeaving, this);
      this.init = bind(this.init, this);
      return ContactSlidePlugin.__super__.constructor.apply(this, arguments);
    }

    ContactSlidePlugin.prototype.init = function() {
      return this.on('leaving.contact', this.onLeaving);
    };

    ContactSlidePlugin.prototype.onLeaving = function(event, current, direction, next) {
      if (direction === 'prev') {
        return this.cancel(event);
      }
    };

    return ContactSlidePlugin;

  })(AbstractFormsliderPlugin);

  this.LoaderSlidePlugin = (function(superClass) {
    extend(LoaderSlidePlugin, superClass);

    function LoaderSlidePlugin() {
      this.isLoading = bind(this.isLoading, this);
      this.onLeaving = bind(this.onLeaving, this);
      this.onLoaderStart = bind(this.onLoaderStart, this);
      this.init = bind(this.init, this);
      return LoaderSlidePlugin.__super__.constructor.apply(this, arguments);
    }

    LoaderSlidePlugin.config = {
      loaderClass: 'SimpleLoaderImplementation',
      duration: 1000
    };

    LoaderSlidePlugin.prototype.init = function() {
      this.on('after.loader', this.onLoaderStart);
      return this.on('leaving.loader', this.onLeaving);
    };

    LoaderSlidePlugin.prototype.onLoaderStart = function(event, currentSlide, direction, nextSlide) {
      var LoaderClass;
      if (this.isLoading()) {
        return;
      }
      LoaderClass = window[this.config.loaderClass];
      this.loader = new LoaderClass(this, this.config, currentSlide);
      return this.loader.start();
    };

    LoaderSlidePlugin.prototype.onLeaving = function(event, current, direction, next) {
      if (direction === 'prev') {
        this.cancel(event);
      }
      if (this.isLoading()) {
        return this.cancel(event);
      }
    };

    LoaderSlidePlugin.prototype.isLoading = function() {
      var ref;
      return (ref = this.loader) != null ? ref.animating : void 0;
    };

    return LoaderSlidePlugin;

  })(AbstractFormsliderPlugin);

  this.AbstractFormsliderLoader = (function() {
    AbstractFormsliderLoader.config = {
      duration: 2000
    };

    function AbstractFormsliderLoader(plugin1, config1, slide1) {
      this.plugin = plugin1;
      this.config = config1;
      this.slide = slide1;
      this.stop = bind(this.stop, this);
      this.doAnimation = bind(this.doAnimation, this);
      this.start = bind(this.start, this);
      this.config = ObjectExtender.extend({}, this.constructor.config, this.config);
      this.animating = false;
    }

    AbstractFormsliderLoader.prototype.start = function() {
      if (this.animating) {
        return false;
      }
      this.plugin.logger.debug("start(" + this.config.duration + ")");
      this.animating = true;
      return setTimeout(this.doAnimation, this.config.duration);
    };

    AbstractFormsliderLoader.prototype.doAnimation = function() {
      return this.stop();
    };

    AbstractFormsliderLoader.prototype.stop = function() {
      this.plugin.logger.debug('stop()');
      this.animating = false;
      return this.plugin.formslider.next();
    };

    return AbstractFormsliderLoader;

  })();

  this.SimpleLoaderImplementation = (function(superClass) {
    extend(SimpleLoaderImplementation, superClass);

    function SimpleLoaderImplementation() {
      return SimpleLoaderImplementation.__super__.constructor.apply(this, arguments);
    }

    return SimpleLoaderImplementation;

  })(AbstractFormsliderLoader);

  this.TrackSessionInformationPlugin = (function(superClass) {
    extend(TrackSessionInformationPlugin, superClass);

    function TrackSessionInformationPlugin() {
      this.inform = bind(this.inform, this);
      this.onFirstInteraction = bind(this.onFirstInteraction, this);
      this.init = bind(this.init, this);
      return TrackSessionInformationPlugin.__super__.constructor.apply(this, arguments);
    }

    TrackSessionInformationPlugin.config = {
      onReady: null,
      onReadyInternal: function(plugin) {
        plugin.inform('url', location.href);
        plugin.inform('useragent', navigator.userAgent);
        plugin.inform('referer', document.referrer);
        plugin.inform('dimension', $(window).width() + 'x' + $(window).height());
        plugin.inform('jquery.formslider.version', plugin.formslider.config.version);
        if (plugin.formslider.plugins.isLoaded('JqueryTrackingPlugin')) {
          plugin.inform('channel', $.tracking.channel());
          return plugin.inform('campaign', $.tracking.campaign());
        }
      }
    };

    TrackSessionInformationPlugin.prototype.init = function() {
      return this.on('first-interaction', this.onFirstInteraction);
    };

    TrackSessionInformationPlugin.prototype.onFirstInteraction = function() {
      if (this.config.onReadyInternal) {
        this.config.onReadyInternal(this);
      }
      if (this.config.onReady) {
        return this.config.onReady(this);
      }
    };

    TrackSessionInformationPlugin.prototype.inform = function(name, value) {
      this.track(name, value, 'info');
      return this.container.append($('<input>', {
        type: 'hidden',
        name: "info[" + name + "]",
        value: value
      }));
    };

    return TrackSessionInformationPlugin;

  })(AbstractFormsliderPlugin);

  this.TrackUserInteractionPlugin = (function(superClass) {
    extend(TrackUserInteractionPlugin, superClass);

    function TrackUserInteractionPlugin() {
      this.setupQuestionAnswerTracking = bind(this.setupQuestionAnswerTracking, this);
      this.setupTransportTracking = bind(this.setupTransportTracking, this);
      this.init = bind(this.init, this);
      return TrackUserInteractionPlugin.__super__.constructor.apply(this, arguments);
    }

    TrackUserInteractionPlugin.config = {
      questionAnsweredEvent: 'question-answered'
    };

    TrackUserInteractionPlugin.prototype.init = function() {
      this.setupQuestionAnswerTracking();
      return this.setupTransportTracking();
    };

    TrackUserInteractionPlugin.prototype.setupTransportTracking = function() {
      return this.on("after", (function(_this) {
        return function(event, currentSlide, direction, prevSlide) {
          var index, role;
          index = _this.formslider.index();
          role = $(currentSlide).data('role');
          _this.track("slide-" + index + "-entered", direction);
          return _this.track("slide-role-" + role + "-entered");
        };
      })(this));
    };

    TrackUserInteractionPlugin.prototype.setupQuestionAnswerTracking = function() {
      return this.on('question-answered', (function(_this) {
        return function(event, $answer, value, slideIndex) {
          var eventName;
          eventName = _this.config.questionAnsweredEvent;
          _this.track(eventName, slideIndex);
          return _this.track(eventName + "-" + slideIndex, value);
        };
      })(this));
    };

    return TrackUserInteractionPlugin;

  })(AbstractFormsliderPlugin);

  this.EqualHeightPlugin = (function(superClass) {
    extend(EqualHeightPlugin, superClass);

    function EqualHeightPlugin() {
      this.doEqualize = bind(this.doEqualize, this);
      this.equalizeAll = bind(this.equalizeAll, this);
      this.init = bind(this.init, this);
      return EqualHeightPlugin.__super__.constructor.apply(this, arguments);
    }

    EqualHeightPlugin.config = {
      selector: '.answer .text'
    };

    EqualHeightPlugin.prototype.init = function() {
      this.on('ready', this.equalizeAll);
      this.on('resize', this.equalizeAll);
      return this.on('do-equal-height', this.doEqualize);
    };

    EqualHeightPlugin.prototype.equalizeAll = function() {
      var i, j, ref, results;
      results = [];
      for (i = j = 0, ref = this.slides.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        results.push(this.doEqualize(null, this.slideByIndex(i)));
      }
      return results;
    };

    EqualHeightPlugin.prototype.doEqualize = function(event, slide) {
      var $element, $elements, element, j, len, maxHeight;
      $elements = $(this.config.selector, slide);
      if (!$elements.length) {
        return;
      }
      maxHeight = 0;
      for (j = 0, len = $elements.length; j < len; j++) {
        element = $elements[j];
        $element = $(element);
        $element.css('height', 'auto');
        maxHeight = Math.max(maxHeight, $element.outerHeight());
      }
      return $elements.css('height', maxHeight);
    };

    return EqualHeightPlugin;

  })(AbstractFormsliderPlugin);

  this.LazyLoadPlugin = (function(superClass) {
    extend(LazyLoadPlugin, superClass);

    function LazyLoadPlugin() {
      this._loadLazyCallback = bind(this._loadLazyCallback, this);
      this.doLazyLoad = bind(this.doLazyLoad, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return LazyLoadPlugin.__super__.constructor.apply(this, arguments);
    }

    LazyLoadPlugin.config = {
      lazyClass: 'lazy-load',
      dataKey: 'src'
    };

    LazyLoadPlugin.prototype.init = function() {
      this.doLazyLoad(this.slideByIndex(0));
      this.doLazyLoad(this.slideByIndex(1));
      return this.on('after', this.onAfter);
    };

    LazyLoadPlugin.prototype.onAfter = function() {
      var currentIndex;
      currentIndex = this.formslider.index();
      return this.doLazyLoad(this.slideByIndex(currentIndex + 1));
    };

    LazyLoadPlugin.prototype.doLazyLoad = function(slide) {
      return $("img." + this.config.lazyClass, slide).each(this._loadLazyCallback);
    };

    LazyLoadPlugin.prototype._loadLazyCallback = function(index, el) {
      var $el;
      $el = $(el);
      return $el.attr('src', $el.data(this.config.dataKey)).removeData(this.config.dataKey).removeClass(this.config.lazyClass);
    };

    return LazyLoadPlugin;

  })(AbstractFormsliderPlugin);

  this.LoadingStatePlugin = (function(superClass) {
    extend(LoadingStatePlugin, superClass);

    function LoadingStatePlugin() {
      this.onReady = bind(this.onReady, this);
      this.init = bind(this.init, this);
      return LoadingStatePlugin.__super__.constructor.apply(this, arguments);
    }

    LoadingStatePlugin.config = {
      selector: '.progressbar-wrapper, .formslider-wrapper',
      loadingClass: 'loading',
      loadedClass: 'loaded'
    };

    LoadingStatePlugin.prototype.init = function() {
      return this.on('ready', this.onReady);
    };

    LoadingStatePlugin.prototype.onReady = function() {
      return $(this.config.selector).removeClass(this.config.loadingClass).addClass(this.config.loadedClass);
    };

    return LoadingStatePlugin;

  })(AbstractFormsliderPlugin);

  this.ScrollUpPlugin = (function(superClass) {
    extend(ScrollUpPlugin, superClass);

    function ScrollUpPlugin() {
      this.isOnScreen = bind(this.isOnScreen, this);
      this.onAfter = bind(this.onAfter, this);
      this.init = bind(this.init, this);
      return ScrollUpPlugin.__super__.constructor.apply(this, arguments);
    }

    ScrollUpPlugin.config = {
      selector: '.headline',
      duration: 200,
      tolerance: 80,
      scrollUpOffset: 30
    };

    ScrollUpPlugin.prototype.init = function() {
      this.on('after', this.onAfter);
      return this.window = $(window);
    };

    ScrollUpPlugin.prototype.onAfter = function(e, current, direction, prev) {
      var $element;
      $element = $(this.config.selector, current);
      if (!$element.length) {
        this.logger.warn("no element found for selector " + this.config.selector);
        return;
      }
      if (this.isOnScreen($element)) {
        return;
      }
      return $("html, body").animate({
        scrollTop: Math.max(0, $element.offset().top - this.config.scrollUpOffset)
      }, this.config.duration);
    };

    ScrollUpPlugin.prototype.isOnScreen = function($element) {
      var bounds, viewport;
      viewport = {
        top: this.window.scrollTop(),
        left: this.window.scrollLeft()
      };
      viewport.right = viewport.left + this.window.width();
      viewport.bottom = viewport.top + this.window.height();
      bounds = $element.offset();
      bounds.right = bounds.left + $element.outerWidth();
      bounds.bottom = bounds.top + $element.outerHeight();
      return !(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top - this.config.tolerance || viewport.top > bounds.bottom - this.config.tolerance);
    };

    return ScrollUpPlugin;

  })(AbstractFormsliderPlugin);

  EventManager = (function() {
    function EventManager(logger) {
      this.logger = logger;
      this.off = bind(this.off, this);
      this.on = bind(this.on, this);
      this.trigger = bind(this.trigger, this);
      this.listener = {};
    }

    EventManager.prototype.trigger = function() {
      var data, event, j, len, listener, name, ref, tags;
      data = slice.call(arguments);
      name = data.shift();
      tags = name.split('.');
      name = tags.shift();
      if (this.listener[name] == null) {
        return;
      }
      event = {
        type: name,
        tags: tags,
        canceled: false
      };
      ref = this.listener[name];
      for (j = 0, len = ref.length; j < len; j++) {
        listener = ref[j];
        if (!listener.tags || this.allTagsInArray(listener.tags, tags)) {
          listener.callback.apply(listener, [event].concat(slice.call(data)));
        }
      }
      return event;
    };

    EventManager.prototype.on = function(name, callback) {
      var base, context, tags;
      tags = name.split('.');
      name = tags.shift();
      context = tags.pop();
      if ((base = this.listener)[name] == null) {
        base[name] = [];
      }
      return this.listener[name].push({
        name: name,
        tags: tags,
        context: context,
        callback: callback
      });
    };

    EventManager.prototype.off = function(name) {
      var context, tags;
      tags = name.split('.');
      name = tags.shift();
      context = tags.pop();
      if (this.listener[name] == null) {
        return;
      }
      return this.listener[name] = this.listener[name].filter((function(_this) {
        return function(listener) {
          if (listener.context !== context) {
            return true;
          }
          if (_this.allTagsInArray(tags, listener.tags)) {
            return false;
          }
        };
      })(this));
    };

    EventManager.prototype.allTagsInArray = function(tags, inputArray) {
      var j, len, tag;
      for (j = 0, len = tags.length; j < len; j++) {
        tag = tags[j];
        if (!(indexOf.call(inputArray, tag) >= 0)) {
          return false;
        }
      }
      return true;
    };

    EventManager.prototype.isCanceled = function(event) {
      return event.canceled === true;
    };

    EventManager.prototype.cancel = function(event) {
      event.canceled = true;
      return false;
    };

    return EventManager;

  })();

  this.FeatureDetector = (function() {
    function FeatureDetector() {}

    FeatureDetector.isMobileDevice = function() {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };

    return FeatureDetector;

  })();

  this.Locking = (function() {
    function Locking(initial) {
      if (initial == null) {
        initial = true;
      }
      this.unlock = bind(this.unlock, this);
      this.lock = bind(this.lock, this);
      this.locked = initial;
    }

    Locking.prototype.lock = function() {
      return this.locked = true;
    };

    Locking.prototype.unlock = function() {
      return this.locked = false;
    };

    return Locking;

  })();

  Logger = (function() {
    function Logger(namespace) {
      this.namespace = namespace;
      this.error = bind(this.error, this);
      this.warn = bind(this.warn, this);
      this.debug = bind(this.debug, this);
      this.info = bind(this.info, this);
      if (!$.debug) {
        if (typeof console !== "undefined" && console !== null) {
          if (typeof console.warn === "function") {
            console.warn('jquery.debug not loaded');
          }
        }
      }
    }

    Logger.prototype.info = function() {
      var ref;
      arguments[0] = this.namespace + "::" + arguments[0];
      return (ref = $.debug).info.apply(ref, arguments);
    };

    Logger.prototype.debug = function() {
      var ref;
      arguments[0] = this.namespace + "::" + arguments[0];
      return (ref = $.debug).debug.apply(ref, arguments);
    };

    Logger.prototype.warn = function() {
      var ref;
      arguments[0] = this.namespace + "::" + arguments[0];
      if ($.debug.isEnabled()) {
        return (ref = $.debug).warn.apply(ref, arguments);
      }
      return typeof console !== "undefined" && console !== null ? typeof console.warn === "function" ? console.warn.apply(console, arguments) : void 0 : void 0;
    };

    Logger.prototype.error = function() {
      var ref;
      arguments[0] = this.namespace + "::" + arguments[0];
      if ($.debug.isEnabled()) {
        return (ref = $.debug).error.apply(ref, arguments);
      }
      return typeof console !== "undefined" && console !== null ? typeof console.error === "function" ? console.error.apply(console, arguments) : void 0 : void 0;
    };

    return Logger;

  })();

  this.ObjectExtender = (function() {
    function ObjectExtender() {}

    ObjectExtender.extend = function(obj) {
      Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        var prop, ref, ref1, results;
        if (!source) {
          return;
        }
        results = [];
        for (prop in source) {
          if (((ref = source[prop]) != null ? ref.constructor : void 0) === Object) {
            if (!obj[prop] || ((ref1 = obj[prop]) != null ? ref1.constructor : void 0) === Object) {
              obj[prop] = obj[prop] || {};
              results.push(ObjectExtender.extend(obj[prop], source[prop]));
            } else {
              results.push(obj[prop] = source[prop]);
            }
          } else {
            results.push(obj[prop] = source[prop]);
          }
        }
        return results;
      });
      return obj;
    };

    return ObjectExtender;

  })();

  this.PluginLoader = (function() {
    function PluginLoader(formslider, globalPluginConfig) {
      this.formslider = formslider;
      this.globalPluginConfig = globalPluginConfig;
      this.get = bind(this.get, this);
      this.isLoaded = bind(this.isLoaded, this);
      this.load = bind(this.load, this);
      this.loadAll = bind(this.loadAll, this);
      this.loaded = {};
    }

    PluginLoader.prototype.loadAll = function(plugins) {
      var j, len, plugin, results;
      results = [];
      for (j = 0, len = plugins.length; j < len; j++) {
        plugin = plugins[j];
        if (!window[plugin["class"]]) {
          this.formslider.logger.warn("loadAll(" + plugin["class"] + ") -> not found");
          continue;
        }
        results.push(this.load(plugin));
      }
      return results;
    };

    PluginLoader.prototype.load = function(plugin) {
      var PluginClass, config, error, pluginInstance;
      PluginClass = window[plugin["class"]];
      if (plugin.config == null) {
        config = this.globalPluginConfig;
      } else {
        config = ObjectExtender.extend({}, this.globalPluginConfig, plugin.config);
      }
      this.formslider.logger.info("loadPlugin(" + plugin["class"] + ")");
      try {
        pluginInstance = new PluginClass(this.formslider, config);
        this.loaded[plugin["class"]] = pluginInstance;
        return pluginInstance;
      } catch (error1) {
        error = error1;
        return this.formslider.logger.error("loadPlugin(" + plugin["class"] + ") -> error", error);
      }
    };

    PluginLoader.prototype.isLoaded = function(name) {
      return name in this.loaded;
    };

    PluginLoader.prototype.get = function(name) {
      if (!this.isLoaded(name)) {
        return;
      }
      return this.loaded[name];
    };

    return PluginLoader;

  })();

  this.FormSlider = (function() {
    FormSlider.config = null;

    function FormSlider(container, config) {
      this.container = container;
      this.goto = bind(this.goto, this);
      this.prev = bind(this.prev, this);
      this.next = bind(this.next, this);
      this.id = bind(this.id, this);
      this.index = bind(this.index, this);
      this.onResize = bind(this.onResize, this);
      this.onReady = bind(this.onReady, this);
      this.onAfter = bind(this.onAfter, this);
      this.onBefore = bind(this.onBefore, this);
      this.loadPlugins = bind(this.loadPlugins, this);
      this.setupDriver = bind(this.setupDriver, this);
      this.setupConfig = bind(this.setupConfig, this);
      this.setupConfig(config);
      this.firstInteraction = false;
      this.logger = new Logger('jquery.formslider');
      this.events = new EventManager(this.logger);
      this.locking = new Locking(true);
      this.setupDriver();
      this.slides = this.driver.slides;
      this.loadPlugins();
      $(window).resize(this.onResize);
    }

    FormSlider.prototype.setupConfig = function(config) {
      if ((config != null ? config.plugins : void 0) != null) {
        FormSlider.config.plugins = [];
      }
      return this.config = ObjectExtender.extend({}, FormSlider.config, config);
    };

    FormSlider.prototype.setupDriver = function() {
      var DriverClass;
      DriverClass = window[this.config.driver["class"]];
      return this.driver = new DriverClass(this.container, this.config.driver, this.onBefore, this.onAfter, this.onReady);
    };

    FormSlider.prototype.loadPlugins = function() {
      this.plugins = new PluginLoader(this, this.config.pluginsGlobalConfig);
      return this.plugins.loadAll(this.config.plugins);
    };

    FormSlider.prototype.onBefore = function(currentIndex, direction, nextIndex) {
      var current, currentRole, event, eventData, next, nextRole, ref, ref1;
      if (this.locking.locked) {
        return false;
      }
      current = this.slides.get(currentIndex);
      currentRole = $(current).data('role');
      next = this.driver.get(nextIndex);
      nextRole = $(next).data('role');
      eventData = [current, direction, next];
      event = (ref = this.events).trigger.apply(ref, ["leaving." + currentRole + "." + direction].concat(slice.call(eventData)));
      if (event.canceled) {
        this.locking.unlock();
        return false;
      }
      (ref1 = this.events).trigger.apply(ref1, ["before." + nextRole + "." + direction].concat(slice.call(eventData)));
      this.lastId = this.id();
      this.lastCurrent = current;
      this.lastNext = next;
      this.lastCurrentRole = nextRole;
      this.lastDirection = direction;
      return true;
    };

    FormSlider.prototype.onAfter = function() {
      var eventData, ref, ref1;
      eventData = [this.lastNext, this.lastDirection, this.lastCurrent];
      (ref = this.events).trigger.apply(ref, ["after." + this.lastCurrentRole + "." + this.lastDirection].concat(slice.call(eventData)));
      if (!this.firstInteraction) {
        this.firstInteraction = true;
        (ref1 = this.events).trigger.apply(ref1, ['first-interaction'].concat(slice.call(eventData)));
      }
      return this.locking.unlock();
    };

    FormSlider.prototype.onReady = function() {
      this.events.trigger('ready');
      return this.locking.unlock();
    };

    FormSlider.prototype.onResize = function() {
      return this.events.trigger('resize');
    };

    FormSlider.prototype.index = function() {
      return this.driver.index();
    };

    FormSlider.prototype.id = function() {
      return $(this.driver.get()).data('id');
    };

    FormSlider.prototype.next = function() {
      if (this.locking.locked) {
        return;
      }
      this.events.trigger('before-driver-next');
      if (this.index() + 1 > this.driver.slides.length - 1) {
        return;
      }
      return this.driver.next();
    };

    FormSlider.prototype.prev = function() {
      if (this.locking.locked) {
        return;
      }
      if (this.index() > 0) {
        return this.driver.prev();
      }
    };

    FormSlider.prototype.goto = function(indexFromZero) {
      if (this.locking.locked) {
        return;
      }
      if (indexFromZero < 0 || indexFromZero > this.slides.length - 1) {
        return;
      }
      return this.driver.goto(indexFromZero);
    };

    return FormSlider;

  })();

  this.FormSlider.config = {
    version: 1,
    driver: {
      "class": 'DriverFlexslider',
      selector: '.formslider > .slide'
    },
    pluginsGlobalConfig: {
      answersSelector: '.answers',
      answerSelector: '.answer',
      answerSelectedClass: 'selected'
    },
    plugins: [
      {
        "class": 'AddSlideClassesPlugin'
      }, {
        "class": 'AnswerClickPlugin'
      }, {
        "class": 'InputFocusPlugin'
      }, {
        "class": 'BrowserHistoryPlugin'
      }, {
        "class": 'JqueryValidatePlugin'
      }, {
        "class": 'NormalizeInputAttributesPlugin'
      }, {
        "class": 'InputSyncPlugin'
      }, {
        "class": 'NextOnKeyPlugin'
      }, {
        "class": 'ArrowNavigationPlugin'
      }, {
        "class": 'TabIndexSetterPlugin'
      }, {
        "class": 'NextOnClickPlugin'
      }, {
        "class": 'LoadingStatePlugin'
      }, {
        "class": 'ProgressBarPlugin'
      }, {
        "class": 'TrackUserInteractionPlugin'
      }, {
        "class": 'LoaderSlidePlugin'
      }, {
        "class": 'ContactSlidePlugin'
      }, {
        "class": 'ConfirmationSlidePlugin'
      }, {
        "class": 'EqualHeightPlugin'
      }, {
        "class": 'ScrollUpPlugin'
      }, {
        "class": 'LazyLoadPlugin'
      }
    ]
  };

  jQuery.fn.formslider = function(config) {
    var $this;
    $this = $(this);
    if (config) {
      $this.formslider = new FormSlider($this, config);
    }
    return $this.formslider;
  };

  jQuery.fn.extend({
    animateCss: function(animationCssClass, duration, complete) {
      return this.each(function() {
        var $this, durationSeconds;
        durationSeconds = duration / 1000;
        $this = $(this);
        $this.css("animation-duration", durationSeconds + 's').addClass("animate " + animationCssClass);
        return setTimeout(function() {
          $this.removeClass("animate " + animationCssClass);
          if (complete) {
            return complete($this);
          }
        }, duration);
      });
    }
  });

  this.JqueryAnimatePlugin = (function(superClass) {
    extend(JqueryAnimatePlugin, superClass);

    function JqueryAnimatePlugin() {
      this.doAnimation = bind(this.doAnimation, this);
      this.init = bind(this.init, this);
      return JqueryAnimatePlugin.__super__.constructor.apply(this, arguments);
    }

    JqueryAnimatePlugin.config = {
      duration: 800,
      selector: '.answer',
      next: {
        inEffect: 'swingReverse',
        outEffect: 'swingReverse'
      },
      prev: {
        inEffect: 'swing',
        outEffect: 'swing'
      }
    };

    JqueryAnimatePlugin.prototype.init = function() {
      return this.on('before.question', this.doAnimation);
    };

    JqueryAnimatePlugin.prototype.doAnimation = function(event, currentSlide, direction, nextSlide) {
      var duration, inEffect, outEffect, selector;
      inEffect = this.config[direction].inEffect;
      outEffect = this.config[direction].outEffect;
      duration = this.config.duration;
      selector = this.config.selector;
      $(selector, currentSlide).animateCss(outEffect, duration);
      return $(selector, nextSlide).animateCss(outEffect, duration);
    };

    return JqueryAnimatePlugin;

  })(AbstractFormsliderPlugin);

  this.DramaticLoaderIplementation = (function(superClass) {
    extend(DramaticLoaderIplementation, superClass);

    function DramaticLoaderIplementation() {
      this.doAnimationOnNextSlide = bind(this.doAnimationOnNextSlide, this);
      this.finishAnimation = bind(this.finishAnimation, this);
      this.doAnimation = bind(this.doAnimation, this);
      return DramaticLoaderIplementation.__super__.constructor.apply(this, arguments);
    }

    DramaticLoaderIplementation.config = {
      duration: 2500,
      finishAnimationDuration: 2500,
      hideElementsOnHalf: '.hide-on-half',
      showElementsOnHalf: '.show-on-half',
      bounceOutOnHalf: '.bounce-out-on-half',
      bounceDownOnNext: '.bounce-down-on-enter'
    };

    DramaticLoaderIplementation.prototype.doAnimation = function() {
      var $elementsToBounceOut, $elementsToHide, $elementsToShow;
      this.plugin.on('leaving.next', this.doAnimationOnNextSlide);
      this.plugin.logger.debug("doAnimation(" + this.config.finishAnimationDuration + ")");
      $elementsToHide = $(this.config.hideElementsOnHalf, this.slide);
      $elementsToShow = $(this.config.showElementsOnHalf, this.slide);
      $elementsToBounceOut = $(this.config.bounceOutOnHalf, this.slide);
      $elementsToHide.fadeOut().animateCss('bounceOut', 400, function() {
        return $elementsToShow.css({
          display: 'block'
        }).fadeIn().animateCss('bounceIn', 500, function() {
          return $elementsToBounceOut.animateCss('bounceOut', 400).animate({
            opacity: 0
          }, 400);
        });
      });
      return this.finishAnimation();
    };

    DramaticLoaderIplementation.prototype.finishAnimation = function() {
      return setTimeout(this.stop, this.config.finishAnimationDuration);
    };

    DramaticLoaderIplementation.prototype.doAnimationOnNextSlide = function(event, current, direction, next) {
      var $elementsToBounceDown;
      $elementsToBounceDown = $(this.config.bounceDownOnNext, next);
      return $elementsToBounceDown.css({
        opacity: 0
      }).animateCss('bounceInDown', 600).animate({
        opacity: 1
      }, 600);
    };

    return DramaticLoaderIplementation;

  })(AbstractFormsliderLoader);

  this.JqueryTrackingPlugin = (function(superClass) {
    extend(JqueryTrackingPlugin, superClass);

    function JqueryTrackingPlugin() {
      this.onTrack = bind(this.onTrack, this);
      this.init = bind(this.init, this);
      return JqueryTrackingPlugin.__super__.constructor.apply(this, arguments);
    }

    JqueryTrackingPlugin.config = {
      initialize: true,
      eventCategory: 'formslider',
      sessionLifeTimeDays: 1,
      cookiePrefix: 'tracking_',
      cookiePath: '.example.com',
      sourceParamName: 'utm_source',
      campaignParamName: 'utm_campaign',
      storageParams: {
        'utm_source': 'organic',
        'utm_campaign': 'organic'
      },
      adapter: []
    };

    JqueryTrackingPlugin.prototype.init = function() {
      if (this.config.initialize) {
        $.tracking(this.config);
      }
      this.on('track', this.onTrack);
      return this.on('form-submitted', function() {
        return $.tracking.conversion();
      });
    };

    JqueryTrackingPlugin.prototype.onTrack = function(event, source, value, category) {
      if (category == null) {
        category = null;
      }
      return $.tracking.event(category || this.config.eventCategory, source, value, '', '');
    };

    return JqueryTrackingPlugin;

  })(AbstractFormsliderPlugin);

  (function($) {
    return Raven.context(function() {
      $.debug(1);
      return window.formslider = $('.formslider-wrapper').formslider({
        version: 1,
        driver: {
          "class": 'DriverFlexslider',
          selector: '.formslider > .slide',
          animationSpeed: 600
        },
        pluginsGlobalConfig: {
          transitionSpeed: 600,
          answersSelector: '.answers',
          answerSelector: '.answer',
          answerSelectedClass: 'selected'
        },
        plugins: [
          {
            "class": 'AddSlideClassesPlugin'
          }, {
            "class": 'JqueryAnimatePlugin'
          }, {
            "class": 'JqueryValidatePlugin'
          }, {
            "class": 'ArrowNavigationPlugin'
          }, {
            "class": 'AnswerClickPlugin'
          }, {
            "class": 'InputFocusPlugin'
          }, {
            "class": 'BrowserHistoryPlugin'
          }, {
            "class": 'NormalizeInputAttributesPlugin'
          }, {
            "class": 'FormSubmissionPlugin'
          }, {
            "class": 'InputSyncPlugin'
          }, {
            "class": 'NextOnKeyPlugin'
          }, {
            "class": 'TabIndexSetterPlugin'
          }, {
            "class": 'NextOnClickPlugin'
          }, {
            "class": 'LoadingStatePlugin',
            config: {
              selector: '.progressbar-wrapper, .formslider-wrapper'
            }
          }, {
            "class": 'ProgressBarPlugin'
          }, {
            "class": 'LoaderSlidePlugin',
            config: {
              loaderClass: 'DramaticLoaderIplementation'
            }
          }, {
            "class": 'ContactSlidePlugin'
          }, {
            "class": 'ConfirmationSlidePlugin'
          }, {
            "class": 'EqualHeightPlugin'
          }, {
            "class": 'ScrollUpPlugin',
            config: {
              scrollUpOffset: 40
            }
          }, {
            "class": 'LazyLoadPlugin'
          }, {
            "class": 'TrackSessionInformationPlugin'
          }, {
            "class": 'TrackUserInteractionPlugin'
          }, {
            "class": 'JqueryTrackingPlugin',
            config: {
              initialize: true,
              adapter: [
                {
                  "class": 'JqueryTrackingGTagmanagerAdapter'
                }
              ]
            }
          }
        ]
      });
    });
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXNsaWRlci5qcyIsInNvdXJjZXMiOlsiZm9ybXNsaWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7QUFBQSxNQUFBLG9CQUFBO0lBQUE7Ozs7OztFQUFNLElBQUMsQ0FBQTtJQUNMLGdCQUFDLENBQUEsTUFBRCxHQUNFO01BQUEsUUFBQSxFQUFnQixzQkFBaEI7TUFDQSxTQUFBLEVBQWdCLE9BRGhCO01BRUEsY0FBQSxFQUFnQixHQUZoQjtNQUdBLFlBQUEsRUFBZ0IsSUFIaEI7TUFJQSxNQUFBLEVBQWdCLElBSmhCO01BS0EsWUFBQSxFQUFnQixLQUxoQjtNQU1BLFVBQUEsRUFBZ0IsS0FOaEI7TUFPQSxTQUFBLEVBQWdCLEtBUGhCO01BUUEsUUFBQSxFQUFnQixLQVJoQjtNQVNBLGFBQUEsRUFBZ0IsS0FUaEI7OztJQVdXLDBCQUFDLFNBQUQsRUFBYSxPQUFiLEVBQXNCLFFBQXRCLEVBQWlDLE9BQWpDLEVBQTJDLE9BQTNDO01BQUMsSUFBQyxDQUFBLFlBQUQ7TUFBWSxJQUFDLENBQUEsU0FBRDtNQUFTLElBQUMsQ0FBQSxXQUFEO01BQVcsSUFBQyxDQUFBLFVBQUQ7TUFBVSxJQUFDLENBQUEsVUFBRDs7Ozs7Ozs7OztNQUN0RCxJQUFDLENBQUEsTUFBRCxHQUFVLGNBQWMsQ0FBQyxNQUFmLENBQXNCLEVBQXRCLEVBQTBCLGdCQUFnQixDQUFDLE1BQTNDLEVBQW1ELElBQUMsQ0FBQSxNQUFwRDtNQUNWLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUE0QixJQUFDLENBQUE7TUFDN0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBUixHQUE0QixJQUFDLENBQUE7TUFDN0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFSLEdBQTRCLElBQUMsQ0FBQTtNQUU3QixJQUFDLENBQUEsTUFBRCxHQUE0QixDQUFBLENBQUUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFWLEVBQW9CLElBQUMsQ0FBQSxTQUFyQjtNQUU1QixJQUFDLENBQUEsU0FB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LENBQUEsRUFBTyxtQkFBVDtXQXBCTyxFQXFCUDtZQUNFLENBQUEsS0FBQSxDQUFBLEVBQU8sbUJBRFQ7WUFFRSxNQUFBLEVBQ0U7Y0FBQSxXQUFBLEVBQWEsNkJBQWI7YUFISjtXQXJCTyxFQTBCUDtZQUFFLENBQUEsS0FBQSxDQUFBLEVBQU8sb0JBQVQ7V0ExQk8sRUEyQlA7WUFBRSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHlCQUFUO1dBM0JPLEVBNEJQO1lBQUUsQ0FBQSxLQUFBLENBQUEsRUFBTyxtQkFBVDtXQTVCTyxFQTZCUDtZQUNFLENBQUEsS0FBQSxDQUFBLEVBQU8sZ0JBRFQ7WUFFRSxNQUFBLEVBQ0U7Y0FBQSxjQUFBLEVBQWdCLEVBQWhCO2FBSEo7V0E3Qk8sRUFrQ1A7WUFBRSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGdCQUFUO1dBbENPLEVBbUNQO1lBQUUsQ0FBQSxLQUFBLENBQUEsRUFBTywrQkFBVDtXQW5DTyxFQW9DUDtZQUFFLENBQUEsS0FBQSxDQUFBLEVBQU8sNEJBQVQ7V0FwQ08sRUFxQ1A7WUFDRSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHNCQURUO1lBRUUsTUFBQSxFQUNFO2NBQUEsVUFBQSxFQUFZLElBQVo7Y0FDQSxPQUFBLEVBQVM7Z0JBQ1A7a0JBQ0UsQ0FBQSxLQUFBLENBQUEsRUFBTyxrQ0FEVDtpQkFETztlQURUO2FBSEo7V0FyQ087U0FiVDtPQURrQjtJQUhQLENBQWY7RUFGRCxDQUFELENBQUEsQ0F5RUUsTUF6RUY7QUFsMUNBIiwic291cmNlc0NvbnRlbnQiOlsiIyBjb2ZmZWVsaW50OiBkaXNhYmxlPW1heF9saW5lX2xlbmd0aFxuIz0gaW5jbHVkZSBkaXN0L3NjcmlwdHMvanF1ZXJ5LmZvcm1zbGlkZXIvc3JjL2NvZmZlZS9qcXVlcnkuZm9ybXNsaWRlci5jb2ZmZWVcblxuIz0gaW5jbHVkZSBkaXN0L3NjcmlwdHMvanF1ZXJ5LmFuaW1hdGUuY3NzL3NyYy9qcXVlcnkuYW5pbWF0ZS5jc3MuY29mZmVlXG4jPSBpbmNsdWRlIGRpc3Qvc2NyaXB0cy9mb3Jtc2xpZGVyLmFuaW1hdGUuY3NzL3NyYy9mb3Jtc2xpZGVyLmFuaW1hdGUuY3NzLmNvZmZlZVxuIz0gaW5jbHVkZSBkaXN0L3NjcmlwdHMvZm9ybXNsaWRlci5kcmFtYXRpYy5sb2FkZXIvc3JjL2Zvcm1zbGlkZXIuZHJhbWF0aWMubG9hZGVyLmNvZmZlZVxuIz0gaW5jbHVkZSBkaXN0L3NjcmlwdHMvZm9ybXNsaWRlci5qcXVlcnkudHJhY2tpbmcvc3JjL2Zvcm1zbGlkZXIuanF1ZXJ5LnRyYWNraW5nLmNvZmZlZVxuIyBjb2ZmZWVsaW50OiBlbmFibGU9bWF4X2xpbmVfbGVuZ3RoXG5cbigoJCkgLT5cblxuICBSYXZlbi5jb250ZXh0KCAtPlxuICAgICQuZGVidWcoMSlcblxuICAgIHdpbmRvdy5mb3Jtc2xpZGVyID0gJCgnLmZvcm1zbGlkZXItd3JhcHBlcicpLmZvcm1zbGlkZXIoXG4gICAgICB2ZXJzaW9uOiAxXG5cbiAgICAgIGRyaXZlcjpcbiAgICAgICAgY2xhc3M6ICAgICdEcml2ZXJGbGV4c2xpZGVyJ1xuICAgICAgICBzZWxlY3RvcjogJy5mb3Jtc2xpZGVyID4gLnNsaWRlJ1xuICAgICAgICBhbmltYXRpb25TcGVlZDogNjAwXG5cbiAgICAgIHBsdWdpbnNHbG9iYWxDb25maWc6XG4gICAgICAgIHRyYW5zaXRpb25TcGVlZDogNjAwXG4gICAgICAgIGFuc3dlcnNTZWxlY3RvcjogJy5hbnN3ZXJzJ1xuICAgICAgICBhbnN3ZXJTZWxlY3RvcjogICcuYW5zd2VyJ1xuICAgICAgICBhbnN3ZXJTZWxlY3RlZENsYXNzOiAnc2VsZWN0ZWQnXG5cbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgIyB7IGNsYXNzOiAnTmV4dFNsaWRlUmVzb2x2ZXJQbHVnaW4nIH1cbiAgICAgICAgeyBjbGFzczogJ0FkZFNsaWRlQ2xhc3Nlc1BsdWdpbicgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnSnF1ZXJ5QW5pbWF0ZVBsdWdpbicgICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdKcXVlcnlWYWxpZGF0ZVBsdWdpbicgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0Fycm93TmF2aWdhdGlvblBsdWdpbicgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnQW5zd2VyQ2xpY2tQbHVnaW4nICAgICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdJbnB1dEZvY3VzUGx1Z2luJyAgICAgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0Jyb3dzZXJIaXN0b3J5UGx1Z2luJyAgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnTm9ybWFsaXplSW5wdXRBdHRyaWJ1dGVzUGx1Z2luJyB9XG4gICAgICAgIHsgY2xhc3M6ICdGb3JtU3VibWlzc2lvblBsdWdpbicgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0lucHV0U3luY1BsdWdpbicgICAgICAgICAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnTmV4dE9uS2V5UGx1Z2luJyAgICAgICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdUYWJJbmRleFNldHRlclBsdWdpbicgICAgICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ05leHRPbkNsaWNrUGx1Z2luJyAgICAgICAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3M6ICdMb2FkaW5nU3RhdGVQbHVnaW4nXG4gICAgICAgICAgY29uZmlnOlxuICAgICAgICAgICAgc2VsZWN0b3I6ICcucHJvZ3Jlc3NiYXItd3JhcHBlciwgLmZvcm1zbGlkZXItd3JhcHBlcidcbiAgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnUHJvZ3Jlc3NCYXJQbHVnaW4nICAgICAgICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzOiAnTG9hZGVyU2xpZGVQbHVnaW4nXG4gICAgICAgICAgY29uZmlnOlxuICAgICAgICAgICAgbG9hZGVyQ2xhc3M6ICdEcmFtYXRpY0xvYWRlcklwbGVtZW50YXRpb24nXG4gICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0NvbnRhY3RTbGlkZVBsdWdpbicgICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdDb25maXJtYXRpb25TbGlkZVBsdWdpbicgICAgICAgfVxuICAgICAgICB7IGNsYXNzOiAnRXF1YWxIZWlnaHRQbHVnaW4nICAgICAgICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzOiAnU2Nyb2xsVXBQbHVnaW4nXG4gICAgICAgICAgY29uZmlnOlxuICAgICAgICAgICAgc2Nyb2xsVXBPZmZzZXQ6IDQwXG4gICAgICAgIH1cbiAgICAgICAgeyBjbGFzczogJ0xhenlMb2FkUGx1Z2luJyAgICAgICAgICAgICAgICB9XG4gICAgICAgIHsgY2xhc3M6ICdUcmFja1Nlc3Npb25JbmZvcm1hdGlvblBsdWdpbicgfVxuICAgICAgICB7IGNsYXNzOiAnVHJhY2tVc2VySW50ZXJhY3Rpb25QbHVnaW4nICAgIH1cbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzOiAnSnF1ZXJ5VHJhY2tpbmdQbHVnaW4nXG4gICAgICAgICAgY29uZmlnOlxuICAgICAgICAgICAgaW5pdGlhbGl6ZTogdHJ1ZVxuICAgICAgICAgICAgYWRhcHRlcjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xhc3M6ICdKcXVlcnlUcmFja2luZ0dUYWdtYW5hZ2VyQWRhcHRlcidcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgKVxuXG5cbiAgKVxuXG5cbikoalF1ZXJ5KVxuIl19
