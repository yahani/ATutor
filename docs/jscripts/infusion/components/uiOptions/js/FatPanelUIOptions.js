var fluid_1_4=fluid_1_4||{};(function($,fluid){fluid.defaults("fluid.uiOptions.fatPanelEventBinder",{gradeNames:["fluid.eventedComponent","autoInit"],finalInitFunction:"fluid.uiOptions.fatPanelEventBinder.finalInit",components:{uiOptionsLoader:{type:"fluid.uiOptions.loader"},slidingPanel:{type:"fluid.slidingPanel"}}});fluid.defaults("fluid.uiOptions.fatPanelEventBinder.binder",{gradeNames:["fluid.eventedComponent","autoInit"]});fluid.registerNamespace("fluid.dom");fluid.dom.getDocumentHeight=function(dokkument){var body=$("body",dokkument)[0];return body.offsetHeight};fluid.uiOptions.fatPanelEventBinder.updateView=function(uiOptions){uiOptions.uiEnhancer.updateFromSettingsStore();uiOptions.events.onSignificantDOMChange.fire()};fluid.uiOptions.fatPanelEventBinder.bindLateEvents=function(uiOptions,eventBinder,fatPanel){eventBinder.uiOptions=uiOptions;uiOptions.events.modelChanged.addListener(function(model){eventBinder.uiEnhancer.updateModel(model.selections);uiOptions.save()});uiOptions.events.onReset.addListener(function(uiOptions){fluid.uiOptions.fatPanelEventBinder.updateView(uiOptions)});uiOptions.events.onSignificantDOMChange.addListener(function(){var dokkument=uiOptions.container[0].ownerDocument;var height=fluid.dom.getDocumentHeight(dokkument);var iframe=fatPanel.markupRenderer.iframe;var attrs={height:height+15};iframe.animate(attrs,400)});fatPanel.slidingPanel.events.afterPanelHide.addListener(function(){fatPanel.markupRenderer.iframe.height(0)})};fluid.uiOptions.fatPanelEventBinder.finalInit=function(that){that.slidingPanel.events.afterPanelShow.addListener(function(){fluid.uiOptions.fatPanelEventBinder.updateView(that.uiOptions)})};fluid.uiOptions.fatPanelEventBinder.showPanel=function(panel,callback){panel.show();callback()};fluid.defaults("fluid.uiOptions.fatPanel",{gradeNames:["fluid.viewComponent"],selectors:{iframe:".flc-uiOptions-iframe"},relativePrefix:"./",components:{slidingPanel:{type:"fluid.slidingPanel",container:"{fatPanel}.container",options:{invokers:{operateShow:{funcName:"fluid.uiOptions.fatPanelEventBinder.showPanel"}}},createOnEvent:"afterRender"},markupRenderer:{type:"fluid.uiOptions.renderIframe",container:"{fatPanel}.dom.iframe",options:{markupProps:{src:"%prefix/FatPanelUIOptionsFrame.html"},events:{afterRender:"{fatPanel}.events.afterRender"}}},uiEnhancer:"{uiEnhancer}",eventBinder:{type:"fluid.uiOptions.fatPanelEventBinder",options:{components:{uiEnhancer:"{fatPanel}.uiEnhancer",uiOptionsLoader:"{fatPanel}.bridge.uiOptionsLoader",slidingPanel:"{fatPanel}.slidingPanel",binder:{type:"fluid.uiOptions.fatPanelEventBinder.binder",priority:"last",options:{events:{onUIOptionsComponentReady:{event:"{uiOptionsLoader}.events.onUIOptionsComponentReady",args:["{arguments}.0","{fluid.uiOptions.fatPanelEventBinder}","{fatPanel}"]}},listeners:{onUIOptionsComponentReady:fluid.uiOptions.fatPanelEventBinder.bindLateEvents}}}}},createOnEvent:"afterRender",priority:"last"},bridge:{type:"fluid.uiOptions.bridge",createOnEvent:"afterRender",priority:"first",options:{components:{markupRenderer:"{fatPanel}.markupRenderer"}}}},uiOptionsTransform:{transformer:"fluid.uiOptions.mapOptions",config:{"*.slidingPanel":"slidingPanel","*.markupRenderer":"markupRenderer","*.markupRenderer.options.prefix":"prefix","*.eventBinder":"eventBinder","selectors.iframe":"iframe","*.bridge.options.templateLoader":"templateLoader","*.bridge.options.prefix":"relativePrefix","*.bridge.options.uiOptions":"uiOptions","*.bridge.options.textControls":"textControls","*.bridge.options.layoutControls":"layoutControls","*.bridge.options.linksControls":"linksControls"}},events:{afterRender:null}});fluid.defaults("fluid.uiOptions.renderIframe",{gradeNames:["fluid.viewComponent","autoInit"],finalInitFunction:"fluid.uiOptions.renderIframe.finalInit",events:{afterRender:null},styles:{containerFlex:"fl-container-flex",container:"fl-uiOptions-fatPanel-iframe"},prefix:"./",markupProps:{style:"overflow-x:hidden; overflow-y:auto;","class":"flc-iframe",src:"%prefix/uiOptionsIframe.html"}});fluid.uiOptions.renderIframe.finalInit=function(that){var styles=that.options.styles;that.options.markupProps=fluid.uiOptions.transformUrls(that.options.markupProps,that.options.prefix);that.iframeSrc=that.options.markupProps.src;that.iframe=$("<iframe/>",that.options.markupProps).appendTo(that.container);that.iframe.addClass(styles.containerFlex);that.iframe.addClass(styles.container);that.iframe.load(that.events.afterRender.fire)};fluid.defaults("fluid.uiOptions.bridge",{gradeNames:["fluid.littleComponent","autoInit"],finalInitFunction:"fluid.uiOptions.bridge.finalInit",iframe:null});fluid.uiOptions.tabSelectRelay=function(uiOptions){uiOptions.events.onSignificantDOMChange.fire()};fluid.defaults("fluid.uiOptions.FatPanelOtherWorldLoader",{gradeNames:["fluid.uiOptions.inline","autoInit"],uiOptionsTransform:{config:{"*.uiOptionsLoader.*.uiOptions":{options:{events:{onSignificantDOMChange:null},components:{uiEnhancer:"{uiEnhancer}",settingsStore:"{uiEnhancer}.settingsStore",preview:{type:"fluid.emptySubcomponent"},tabs:{type:"fluid.tabs",container:"body",createOnEvent:"onUIOptionsComponentReady",options:{events:{boiledTabShow:{event:"tabsshow",args:["{uiOptions}"]}},listeners:{boiledTabShow:fluid.uiOptions.tabSelectRelay}}}}}}}}});fluid.uiOptions.bridge.finalInit=function(that){var iframe=that.markupRenderer.iframe;var origPrefix=that.markupRenderer.options.prefix;var iframeDoc=iframe.contents();var iframeWin=iframe[0].contentWindow;var innerFluid=iframeWin.fluid;var container=$("body",iframeDoc);var outerLocation=window.location.href;var iframeLocation=iframeWin.location.href;var relativePrefix=fluid.url.computeRelativePrefix(outerLocation,iframeLocation,origPrefix);that.options.relativePrefix=relativePrefix;var overallOptions={};overallOptions.container=container;var bridgeMapping=fluid.defaults("fluid.uiOptions.fatPanel").uiOptionsTransform.config;var swappedBridgeMapping={};fluid.each(bridgeMapping,function(value,key){if(typeof value==="string"){swappedBridgeMapping[value]=key}});var bridgeSymbol="*.bridge.options";fluid.each(swappedBridgeMapping,function(value,key){if(value.indexOf(bridgeSymbol)===0&&that.options[key]){var keyInOtherWorld=value.substring(bridgeSymbol.length+1);fluid.set(overallOptions,keyInOtherWorld,that.options[key])}});var defaults=fluid.defaults("fluid.uiOptions.FatPanelOtherWorldLoader");var mappedOptions=fluid.uiOptions.mapOptions(overallOptions,defaults.uiOptionsTransform.config,defaults.mergePolicy);var component=innerFluid.invokeGlobalFunction("fluid.uiOptions.FatPanelOtherWorldLoader",[container,mappedOptions]);that.uiOptionsLoader=component.uiOptionsLoader};fluid.uiOptions.fatPanel=function(container,options){var defaults=fluid.defaults("fluid.uiOptions.fatPanel");var config=defaults.uiOptionsTransform.config;var mappedOptions=fluid.uiOptions.mapOptions(options,config,defaults.mergePolicy,config);var that=fluid.initView("fluid.uiOptions.fatPanel",container,mappedOptions);fluid.initDependents(that);return that}})(jQuery,fluid_1_4);