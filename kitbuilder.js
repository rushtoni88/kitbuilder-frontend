require([
    'jquery',
    'alpine',
    'mage/url',
    'mage/translate'
], function( $, alpine, mageUrl, $t ) {

    var $bundleLanding = $('.kitbuilder-landing-outer-container');
    var $bundleLandingConfigureBtn = $bundleLanding.find('.action--init-configure-bundle-product');
    var $bundleInfoMain = $( '.product-info-main' );
    var $bundleOptions = $( '.bundle-options-wrapper' );
    var $bundleSummary = $( '.block-bundle-summary' );
    var $bundleSummaryBar = $( '.kitbuilder-summary-bar' );
    var $bundleSummaryBarInner = $( '.kitbuilder-summary-bar-inner' );
    var $bundleSummaryBarDotsContainer = $bundleSummaryBar.find('.summary-bar-dots-container');
    var $bundleSummaryBarToggleBtn = $bundleSummaryBar.find('.action--summary-toggle');
    var $moreDetailsSidebar = $( '.kitbuilder-more-details-sidebar' );
    var $actionCloseMoreDetailsSidebar = $moreDetailsSidebar.find('.action--close-more-details-sidebar');
    var isBundleOptionEntrySwatchOptInitialised = false;

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    $(function () {

        if( $bundleLanding.length && $bundleLandingConfigureBtn.length ) {

            $bundleInfoMain.addClass('hidden');

            $bundleLandingConfigureBtn.on('click', function(e) {

                e.preventDefault();

                $bundleSummaryBar.fadeIn();
                $bundleLanding.hide();
                $bundleOptions.addClass('open');
                $bundleInfoMain.removeClass('hidden');

                $('html, body').animate({
                    scrollTop: $bundleInfoMain.offset().top - 100
                }, 1000);

            });

        }

        // Bind the toggle between summary and items
        if( $bundleSummaryBarToggleBtn.length ) {

            $bundleSummaryBarToggleBtn.on('click', function( e ) {

                e.preventDefault();

                if( $bundleSummary.hasClass('open') ) {
                    window.kbCloseSummary();
                } else {
                    window.kbOpenSummary();
                }

            });

        }

        // Bind the toggle between summary and items
        if( $actionCloseMoreDetailsSidebar.length ) {

            $actionCloseMoreDetailsSidebar.on('click', function( e ) {

                e.preventDefault();

                window.kbCloseMoreDetails();

            });

        }

        function generateKitbuilderProgramaticOption(customOptionCode, optionType) {

            if( optionType == 'swatch' ) {

                var $swatchAttribute = $('.bundle-options-wrapper .fieldset-bundle-options .field .bundle-option-entry-options-outer-container .swatch-opt .swatch-attribute.' + customOptionCode);

                if( $swatchAttribute.length ) {

                    // Grab the first one and map its values.
                    var $firstSwatchAttribute = $swatchAttribute.first();
                    var swatchAttributeLabel = $firstSwatchAttribute.find('.swatch-attribute-label').text();

                    // Replace relavent information in the template and render it at the top.

                    var kitbuilderProgramaticOptionTemplate = $('#kitbuilder-programatic-option-template').text();
                    kitbuilderProgramaticOptionTemplate = kitbuilderProgramaticOptionTemplate.replaceAll('DD_REPLACE_WITH_CLASS', customOptionCode);
                    kitbuilderProgramaticOptionTemplate = kitbuilderProgramaticOptionTemplate.replaceAll('DD_REPLACE_WITH_LABEL', swatchAttributeLabel);
                    var $kitbuilderProgramaticOptionTemplateProcessed = $(kitbuilderProgramaticOptionTemplate);
                    $kitbuilderProgramaticOptionTemplateProcessed.insertBefore($('.bundle-options-wrapper .fieldset-bundle-options .field').first());

                    // Populate the values of the new kitbuilder option.
                    var $swatchAttributeSelect = $firstSwatchAttribute.find('.swatch-select.' + customOptionCode);
                    if( $swatchAttributeSelect.length ) {

                        $swatchAttributeSelect.find('option').each(function() {

                            if( $( this ).val() != 0 ) {

                                $kitbuilderProgramaticOptionTemplateProcessed.find('.control-master-container').append(
                                    '<a href="#" class="action action-large secondary d-block action-hand action-hand-' + $( this ).val() + '" @click.prevent="onSelection(' + $( this ).val() + ')">' + $( this ).text() + '</a>'
                                );

                            }

                        });

                    }

                }

            } else if( optionType == 'data-attribute' ) {

                // Grab the first one and map its values.
                var swatchAttributeLabel = 'Unknown';

                if( customOptionCode == 'griptype' ) {

                    swatchAttributeLabel = $t('Grip Type');
                    var $swatchAttribute = $('.bundle-options-wrapper .fieldset-bundle-options .field .bundle-option-entry-options-outer-container .swatch-opt[data-attr-grip-type]');

                    if( !$swatchAttribute.length ) {

                        console.log('Kitbuilder - Expected Grip Type data-attr-grip-type attribute but did not find any.');
                        return;

                    }

                }

                // Replace relavent information in the template and render it at the top.
                var kitbuilderProgramaticOptionTemplate = $('#kitbuilder-programatic-option-template').text();
                kitbuilderProgramaticOptionTemplate = kitbuilderProgramaticOptionTemplate.replaceAll('DD_REPLACE_WITH_CLASS', customOptionCode);
                kitbuilderProgramaticOptionTemplate = kitbuilderProgramaticOptionTemplate.replaceAll('DD_REPLACE_WITH_LABEL', swatchAttributeLabel);

                var $kitbuilderProgramaticOptionTemplateProcessed = $(kitbuilderProgramaticOptionTemplate);
                $kitbuilderProgramaticOptionTemplateProcessed.insertBefore($('.bundle-options-wrapper .fieldset-bundle-options .field').first());

                var kitbuilderProgramaticOptionGripTypeTemplate = $('#kitbuilder-programatic-option-grip-type-template').html();
                var hasPistolGrip = false;
                var hasFrenchGrip = false;

                // Populate the values of the new kitbuilder option.
                $swatchAttribute.each(function() {

                    var _dataAttrGripTypeValue = $( this ).data('attr-grip-type');

                    if( _dataAttrGripTypeValue == 414 ) {

                        // Pistol
                        hasPistolGrip = true;

                    } else if( _dataAttrGripTypeValue == 415 ) {

                        // French
                        hasFrenchGrip = true;

                    }

                });

                if( !hasPistolGrip ) {
                    kitbuilderProgramaticOptionGripTypeTemplate.find('.bundle-selection-data[data-selection-id="999414999"]').remove();
                }

                if( !hasFrenchGrip ) {
                    kitbuilderProgramaticOptionGripTypeTemplate.find('.bundle-selection-data[data-selection-id="999415999"]').remove();
                }

                $kitbuilderProgramaticOptionTemplateProcessed.find('.control-master-container').append(kitbuilderProgramaticOptionGripTypeTemplate);

            }

        }

        function generateKitbuilderOptionToProductMap() {

            window.optionAttributeValMap = [];

            // Find any duplicate swatches and arrange them above the normal options on the kitbuilder.
            var $swatchAttributesOpt = $('.bundle-options-wrapper .fieldset-bundle-options .field .bundle-option-entry-options-outer-container .swatch-opt');

            $swatchAttributesOpt.each(function() {

                var $_swatchOptContainer = $( this );
                var _swatchOptionId = $_swatchOptContainer.data('option-id');
                var _swatchOptionSubId = $_swatchOptContainer.data('sub-id');
                var $swatchDataForOptionEl = $("div[data-swatch-id='" + _swatchOptionId + "-" + _swatchOptionSubId + "']");
                var $optionAttributes = $('[name^="super_attribute[' + _swatchOptionId + '][' + _swatchOptionSubId + ']"]');
                var optionAttributesCount = $optionAttributes.length;

                // Create the option to product id mapping for configurables within the bundle.
                if( $swatchDataForOptionEl.length && optionAttributesCount ) {

                    var swatchDataForOption = $swatchDataForOptionEl.data()['mageSwatchRenderer']['options']['jsonConfig']['index'];

                    // Loop through the swatch data and cross reference it with our attribute values to get the selected product id.
                    if( optionAttributesCount ) {

                        for (var swatchDataProductId in swatchDataForOption) {

                            if (swatchDataForOption.hasOwnProperty(swatchDataProductId)) {

                                var processedOptionMap = _swatchOptionId + '_' + _swatchOptionSubId + '_';

                                for (var swatchDataForOptionAttributeId in swatchDataForOption[swatchDataProductId]) {

                                    if (swatchDataForOption[swatchDataProductId].hasOwnProperty(swatchDataForOptionAttributeId)) {
                                        processedOptionMap += swatchDataForOptionAttributeId + '_' + swatchDataForOption[swatchDataProductId][swatchDataForOptionAttributeId] + '_';
                                    }

                                }

                                // Chop off the trailing _ if its there.
                                if( processedOptionMap.slice(-1) == '_' ) {
                                    processedOptionMap = processedOptionMap.substring(0, processedOptionMap.length - 1);
                                }

                                window.optionAttributeValMap[processedOptionMap] = swatchDataProductId;

                            }

                        }

                    }

                }

            });

        }

        function onKitbuilderSwatchInputChange(event) {

            var $_currInput = $( this );
            var $_swatchOptContainer = $_currInput.closest('.swatch-opt');
            var $_swatchOptBundleParentContainer = $_swatchOptContainer.parent();
            var _swatchOptionId = $_swatchOptContainer.data('option-id');
            var _swatchOptionSubId = $_swatchOptContainer.data('sub-id');
            var $optionAttributes = $('[name^="super_attribute[' + _swatchOptionId + '][' + _swatchOptionSubId + ']"]');
            var optionAttributesCount = $optionAttributes.length;


            // Create the option to product id mapping for configurables within the bundle.
            if( optionAttributesCount ) {

                var optionMapString = _swatchOptionId + '_' + _swatchOptionSubId + '_';

                $optionAttributes.each(function() {

                    var $_optionAttributeInput = $( this );
                    var _optionAttributeValue = $_optionAttributeInput.val();
                    var $_optionAttributeParent = $_optionAttributeInput.parent();
                    var _optionAttributeId = $_optionAttributeParent.data('attribute-id');

                    if( typeof _optionAttributeId !== 'undefined' ) {
                        optionMapString += _optionAttributeId + '_' + _optionAttributeValue + '_';
                    }

                });

                // Chop off the trailing _ if its there.
                if( optionMapString.slice(-1) == '_' ) {
                    optionMapString = optionMapString.substring(0, optionMapString.length - 1);
                }

                // Get the product id from these values.
                if( typeof window.optionAttributeValMap !== 'undefined' && typeof window.optionAttributeValMap[optionMapString] !== 'undefined' ) {

                    // Get the stockQty from the product id.
                    var _productId = window.optionAttributeValMap[optionMapString];

                    // If stockQty == 0, then on backorder.
                    var $swatchDataForOptionEl = $("div[data-swatch-id='" + _swatchOptionId + "-" + _swatchOptionSubId + "']");

                    if( $swatchDataForOptionEl.length ) {

                        var qtyDataForOption = $swatchDataForOptionEl.data()['mageSwatchRenderer']['options']['jsonConfig']['stockQty'];

                        if( typeof qtyDataForOption[_productId] !== 'undefined' && qtyDataForOption[_productId] == 0 ) {

                            if( $_swatchOptBundleParentContainer.length ) {

                                $_swatchOptBundleParentContainer.find('.kitbuilder-add-btn-container .action--add').addClass('has-backorder').text($t('Backorder'));
                                if( !$_swatchOptBundleParentContainer.find('.product-stock-notification-modal-toggle').length ) {
                                    $_swatchOptBundleParentContainer.find('.kitbuilder-add-btn-container').append(
                                        '<div class="product alert product-stock-notification-modal-toggle" data-mage-init=\'{"productStockNotification":{}}\'>' +
                                            '<a href="#" title="' + $t('Email me when available.') + '" class="action alert" data-product-id="' + _productId + '">' +
                                                $t('Email me when available.') +
                                            '</a>' +
                                        '</div>'
                                    );
                                }
                                    // $('.stock.available').html($t('In stock')).hide();
                                $_swatchOptBundleParentContainer.trigger('contentUpdated');

                            }

                        } else {

                            if( $_swatchOptBundleParentContainer.length && $_swatchOptBundleParentContainer.find('.kitbuilder-add-btn-container .action--add').hasClass('has-backorder') ) {
                                $_swatchOptBundleParentContainer.find('.kitbuilder-add-btn-container .action--add').removeClass('has-backorder').text($t('Add'));
                                $_swatchOptBundleParentContainer.find('.kitbuilder-add-btn-container .product-stock-notification-modal-toggle').remove();
                            }
                        }

                    }

                }

            }

        }

        function kitbuilderReadyAndInitialised() {

            // Find any duplicate swatches and arrange them above the normal options on the kitbuilder.
            var $swatchAttributes = $('.bundle-options-wrapper .fieldset-bundle-options .field .bundle-option-entry-options-outer-container .swatch-opt .swatch-attribute');
            var $swatchAttributesParentContainer = $('.bundle-options-wrapper .fieldset-bundle-options .field .bundle-option-entry-options-outer-container .swatch-opt');

            // Not a swatch attribute. Data attr manually added.
            if( $swatchAttributesParentContainer.filter('[data-attr-grip-type]').length ) {

                // Generate the html for grip type.
                generateKitbuilderProgramaticOption('griptype', 'data-attribute');

            }

            // A swatch attribute
            if( $swatchAttributesParentContainer.find('.swatch-attribute.hand').length ) {

                // Generate the html for hand.
                generateKitbuilderProgramaticOption('hand', 'swatch');

            }

            // Preprocess the option mapping as it wouldn't be ideal to repeatadly do this on the fly.
            generateKitbuilderOptionToProductMap();

            // Listen for changes to any option attributes.
            $swatchAttributes.find('.swatch-input').on('change', onKitbuilderSwatchInputChange);

            // Open the first one by default.
            setTimeout(function() {

                try {
                    $bundleOptions.find('.fieldset-bundle-options .field').first()[0].__x.$data.open();
                } catch (error) {
                    console.warn('Kitbuilder - Could not open first item.', error);
                }

            }, 500);

        }

        var onBundleOptionEntrySwatchOptInitialised = debounce(function() {

            if(!isBundleOptionEntrySwatchOptInitialised) {

                isBundleOptionEntrySwatchOptInitialised = true;

                setTimeout(function() {
                    kitbuilderReadyAndInitialised();
                }, 500);

            }

        }, 250);

        function init() {

            var checkExist = setInterval(function () {

                var $bundleOptionEntrySwatchOptContainer = $('.bundle-options-wrapper .fieldset-bundle-options .field .control-master-container .select-images .bundle-option-entry-container .swatch-opt');

                if ($bundleOptionEntrySwatchOptContainer.length) {

                    $bundleOptionEntrySwatchOptContainer.on('swatch.initialized', function() {
                        onBundleOptionEntrySwatchOptInitialised()
                    });
                    clearInterval(checkExist);

                    setTimeout(function() {

                        if(!isBundleOptionEntrySwatchOptInitialised) {
                            onBundleOptionEntrySwatchOptInitialised();
                        }

                    }, 2000);

                }

            }, 50); // check every 50ms

            // bumped to wait up to 3 minutes.
            setTimeout(function () {
                clearInterval(checkExist);
            }, 180000);

        }

        // Kick off the init process.
        init();

        function handleSummaryBarSticky() {

            if ( $( window ).scrollTop() >= $bundleSummaryBar[0].offsetTop ) {
                $bundleSummaryBarInner.addClass('sticky');
            } else {
                $bundleSummaryBarInner.removeClass('sticky');
            }

            if($('#product-addtocart-button').html().includes($t("Backorder"))) {

                $('.stock.backorder').show();
                $('.stock.available').hide();

            } else {

                $('.stock.backorder').hide();
                $('.stock.available').show();

            }
        }

        var onKbWindowScroll = _.throttle(function() {

            handleSummaryBarSticky();

        }, 50);

        $( window ).scroll( onKbWindowScroll );

    });

    window.kbOnProgramaticOptionSelected = function(customOptionCode, selectionValue) {

        // console.log('kbOnProgramaticOptionSelected', {customOptionCode}, {selectionValue});

        if( customOptionCode == 'hand' || customOptionCode == 'tang_length' ) {

            // Do the new logic for the current selection.
            var $swatchAttribute = $('.bundle-options-wrapper .fieldset-bundle-options .field .bundle-option-entry-options-outer-container .swatch-opt .swatch-attribute.' + customOptionCode);

            if( $swatchAttribute.length ) {

                $swatchAttribute.addClass('hide-programatic-option-selected');

                if( customOptionCode == 'hand' ) {

                    $('.option-programatically-created-hand .action-hand').removeClass('primary').addClass('secondary');
                    $('.option-programatically-created-hand .action-hand.action-hand-' + selectionValue).addClass('primary').removeClass('secondary');

                }

                // Change the value of all the selectboxes for this customOptionCode.
                var $swatchAttributeSelect = $swatchAttribute.find('.swatch-select.' + customOptionCode);
                if( $swatchAttributeSelect.length ) {

                    $swatchAttributeSelect.each(function() {

                        var $newOptionValue = $( this ).find('option[value="' + selectionValue + '"]');

                        if( $newOptionValue.length ) {

                            $swatchAttributeSelect.val(selectionValue).trigger('change').trigger('input');

                        } else {
                            console.warn('Kitbuilder - New value needs selecting but could not be found in selectbox.', {selectionValue}, {customOptionCode});
                        }

                        // Figure out if we need to hide the show options button or not, now we preselect and hide the hand option.
                        var $parentBundleEntryOption = $( this ).closest('.bundle-option-entry-options-outer-container');
                        var $_parentBundleSelectionData = $parentBundleEntryOption.parent();

                        // Check if each swatch-opt has contents.
                        var hasChildren = $parentBundleEntryOption.find('.swatch-opt').children().not('.hide-programatic-option-selected').length;

                        // If have  no children then hide the show options button and the show options container
                        if( !hasChildren ) {

                            $parentBundleEntryOption.addClass('hidden');
                            $_parentBundleSelectionData.find('.product-info-buttons-container .action--show-options').addClass('hidden');

                        }

                    });

                }

            }

        } else if( customOptionCode == 'griptype' ) {

            var $swatchAttribute = null;
            var $allGripTypeSwatchOpts = $('.bundle-options-wrapper .fieldset-bundle-options .field .bundle-option-entry-options-outer-container .swatch-opt[data-attr-grip-type="414"], .bundle-options-wrapper .fieldset-bundle-options .field .bundle-option-entry-options-outer-container .swatch-opt[data-attr-grip-type="415"]');

            $('.option-programatically-created-griptype .select-link').removeClass('active');
            $('.option-programatically-created-griptype .select-link[data-selection-id-tmp="' + selectionValue + '"]').addClass('active');

            if( $allGripTypeSwatchOpts.length ) {

                // Unset the select for fields.
                if( $allGripTypeSwatchOpts.parents('.field').length ) {

                    var fieldRequiresResetProcessed = [];

                    // Remove active styling
                    $allGripTypeSwatchOpts.find('');

                    // Add to new one.
                    // data-selection-id-tmp="414"

                    $allGripTypeSwatchOpts.each(function() {

                        var $fieldRequiresReset = $( this ).parents('.field').first();
                        var fieldRequiresResetData = $fieldRequiresReset[0].__x.$data;
                        var $fieldRequiresResetProductBundleSelect = $( fieldRequiresResetData.productBundleSelect );

                        // Dont trigger multiple select updates for the same select as it slows down.
                        if( typeof fieldRequiresResetProcessed[$fieldRequiresResetProductBundleSelect.attr('id')] == 'undefined' ) {

                            fieldRequiresResetProcessed[$fieldRequiresResetProductBundleSelect.attr('id')] = true;
                            $fieldRequiresResetProductBundleSelect.val('').trigger('change').trigger('input');

                            // Mark dot as unchosen
                            fieldRequiresResetData.chosen = false;

                            // Mark dot as uncomplete
                            window.kbSummaryBarUncompleteDot(fieldRequiresResetData.optionId);

                            // Remove select-link active
                            $fieldRequiresReset.find('.select-link.active').removeClass('active');

                        }

                    });

                }

                // Hide all of the options
                if( $allGripTypeSwatchOpts.parents('.bundle-option-entry-container').length ) {

                    $allGripTypeSwatchOpts.parents('.bundle-option-entry-container').addClass('hide-programatic-option-selected');

                }

            }

            if( selectionValue == 414 ) {

                // Pistol
                $swatchAttribute = $('.bundle-options-wrapper .fieldset-bundle-options .field .bundle-option-entry-options-outer-container .swatch-opt[data-attr-grip-type="414"]');

                // If pistol is selected, preselect the tang_length: short (208)
                window.kbOnProgramaticOptionSelected('tang_length', 208);

            } else if( selectionValue == 415 ) {

                // French
                $swatchAttribute = $('.bundle-options-wrapper .fieldset-bundle-options .field .bundle-option-entry-options-outer-container .swatch-opt[data-attr-grip-type="415"]');

                // If french is selected, preselect the tang_length: long (209)
                window.kbOnProgramaticOptionSelected('tang_length', 209);

            }

            // Then manually unhide the current selected.
            if( $swatchAttribute && $swatchAttribute.length ) {

                var $selectedBundleOptionEntryContianer = $swatchAttribute.closest('.bundle-option-entry-container');

                $selectedBundleOptionEntryContianer.removeClass('hide-programatic-option-selected');

            }

        }

    }

    window.kbCloseSummary = function() {

        $bundleOptions.addClass('open');
        $bundleInfoMain.removeClass('hidden');
        $bundleSummary.removeClass('open');

    }

    window.kbOpenSummary = function() {

        $bundleOptions.removeClass('open');
        $bundleInfoMain.addClass('hidden');
        $bundleSummary.addClass('open');

    }

    window.kbSummaryBarAddDot = function(optionId,prepend) {

        if( typeof prepend == 'undefined' || prepend == null ) {
            prepend = false;
        }

        var isActive = false;

        // Active visible for the very first item
        if( !$bundleSummaryBarDotsContainer.find('.summary-bar-dot').length ) {
            isActive = true;
        }

        var _dotHtml = $('<span class="summary-bar-dot summary-bar-dot--'+ optionId +' ' + (isActive ? 'active' : '') + '">&nbsp;</span>');

        if( prepend ) {
            _dotHtml.addClass('prepended')
            _dotHtml.insertBefore($bundleSummaryBarDotsContainer.find('.summary-bar-dot:not(\'.prepended\')').first());
        } else {
            $bundleSummaryBarDotsContainer.append(_dotHtml);
        }

    }

    window.kbSummaryBarActiveDot = function(optionId) {

        var $_dot = $bundleSummaryBarDotsContainer.find('.summary-bar-dot--'+ optionId);

        // Remove any existing actives
        $bundleSummaryBarDotsContainer.find('.summary-bar-dot').removeClass('active');

        // Add current one active
        $_dot.addClass('active');

    }

    window.kbSummaryBarRemoveActiveDots = function() {

        $bundleSummaryBarDotsContainer.find('.summary-bar-dot').removeClass('active');

    }

    window.kbSummaryBarCompleteDot = function(optionId) {

        var $_dot = $bundleSummaryBarDotsContainer.find('.summary-bar-dot--'+ optionId);

        $_dot.addClass('complete');

    }
    window.kbSummaryBarUncompleteDot = function(optionId) {

        var $_dot = $bundleSummaryBarDotsContainer.find('.summary-bar-dot--'+ optionId);

        $_dot.removeClass('complete');

    }

    window.kbOpenMoreDetails = function(productId) {

        // Close the summary when clicked outside

        $(document).click(function (event) {
            const $target = $(event.target);
            if (!$target.closest('.kitbuilder-more-details-sidebar').length && $moreDetailsSidebar.hasClass('open')) {
                console.log("clicked outside the element")
                window.kbCloseMoreDetails();
            }
        });

        // Added setTimeout because otherwise click on the "more options" ubttopn triggered click outside more details
        // sidebar and closed it.
        setTimeout(()=>{
            // Find or create the iframe
            var $iframe = $moreDetailsSidebar.find('iframe');
            var productPageSlimmedUrl = mageUrl.build('kitbuilder/kitbuilder/details?id=' + productId);

            if( $iframe.length ) {
                $iframe.remove();
            }

            $iframe = $moreDetailsSidebar.prepend('<iframe frameborder="0" scrolling="no" seamless="seamless" src="' + productPageSlimmedUrl + '" onload="this.style.height=(this.contentWindow.document.body.scrollHeight+20)+\'px\';"></iframe>');

            // Open the more details sidebar.
            $moreDetailsSidebar.addClass('open');
            $('body').addClass('more-details-sidebar-open');
            $('body').addClass('fade-page-wrapper');
        }, 100)


    }

    window.kbCloseMoreDetails = function() {

        // Find or create the iframe
        var $iframe = $moreDetailsSidebar.find('iframe');

        if( $iframe.length ) {
            $iframe.remove();
        }

        $moreDetailsSidebar.removeClass('open');
        $('body').removeClass('more-details-sidebar-open');
        $('body').removeClass('fade-page-wrapper');

    }

});
