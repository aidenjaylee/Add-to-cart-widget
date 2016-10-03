/*
 *  jquery list view add to cart - v1.0.0
 *
 */

;( function( $, window, document, undefined ) {

	"use strict";

		var pluginName = "listViewAddToCart",
	    	defaults = {
	        add:null,
	        change:null,
	        delete:null,
	        quantity: 0.0,
	        attributes:null,
	        selectors:null,
	        isComplete: $.noop
	    };

		// The actual plugin constructor
		function Plugin ( element, options ) {
	        this.options = $.extend( {}, defaults, options );
	        this._defaults = defaults;
	        this._name = pluginName;
	        this.element = element;

			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {

			init: function() {
	            var opts = this.options,
	                $this  = $(this.element); // Current link

	            if (opts.addAll !== undefined) {
	            	var addCheckedToCart = opts.selectors.addAllProducts,
		            	selected = opts.selectors.selected,
		            	addProduct = opts.selectors.addProduct;
		            	// console.log(addCheckedToCart, saveCheckedAsNewList, selected);
		            	console.log('getChecked');
                	this.getChecked(addCheckedToCart, selected);
	            } 
	            // else {
	            // if ($this.attr(opts.attributes.productCode) !== undefined) {

	            	var productCode = $this.attr(opts.attributes.productCode),
	                quantity = $this.attr(opts.attributes.quantity),

	                quantityMin = $this.attr(opts.attributes.quantityMin),
	                quantityMax = $this.attr(opts.attributes.quantityMax),
	                quantityIncrement = $this.attr(opts.attributes.quantityIncrement),
	                unit = $this.attr(opts.attributes.unit);

					if (quantityIncrement.indexOf(".") && quantityIncrement == 1 ) {
						// console.log('yes');
						var quantityIncrement = 1;
						$this.attr(opts.attributes.quantityIncrement, quantityIncrement);
					}
	                
	                if(quantityMin == 0.5 && quantityIncrement == 1) {
	                	// alert('find! min:'+quantityMin+'and quantityIncrement'+quantityIncrement);
	                	var quantityMin = 1;
						$this.attr(opts.attributes.quantityMin, quantityIncrement);
	                }

	            var addProduct = opts.selectors.addProduct,
	                deleteProduct = opts.selectors.deleteProduct;

	            var qntSpan = opts.selectors.quantitySpan,
	            	qntInput = opts.selectors.quantityInput;

	            var quantityUp = opts.selectors.quantityUp,
	                quantityDown = opts.selectors.quantityDown,
	                itemInBasketContainer = opts.selectors.itemInBasketContainer,
	                itemNotInBasketContainer = opts.selectors.itemNotInBasketContainer;
	            
	                // opts.add(productCode, qty, callback);

					this.loadBasketBlock($this, quantity, quantityMin, unit, qntSpan, qntInput, itemInBasketContainer, itemNotInBasketContainer);
					this.addProduct( addProduct, productCode, quantity, qntSpan, qntInput, quantityMin, quantityMax, unit);
					this.changeProduct(quantityUp, quantityDown, productCode, quantity, qntSpan, quantityMin, quantityMax, unit);
					this.deleteProduct(deleteProduct, productCode, quantity, qntSpan, qntInput, quantityMin, unit);

	            // }

			},
			genProductData: function (json, productCode, unit, element) {
				var $this = $(this.element);
				var plugin = this;
				var opts = this.options;

				json["productCode"] = productCode;
		        json["unit"] = unit;
		        json["element"] = element;

		        return json;
			},
			addProduct: function( addProduct, productCode, quantity, qntSpan, qntInput, quantityMin, quantityMax, unit){
				var $this = $(this.element);
				var plugin = this;
				var opts = this.options;
				var product = {};
				// var product = [];
				plugin.genProductData(product,productCode, unit, $this);

		        // product.push(item);
				$this.on('click', addProduct, function(e, addCallback){
	                e.preventDefault();

	                var itemInBasketContainer = opts.selectors.itemInBasketContainer,
	                	itemNotInBasketContainer = opts.selectors.itemNotInBasketContainer;

	                var itemInBasketContainer = $this.find(itemInBasketContainer),
	                	itemNotInBasketContainer = $this.find(itemNotInBasketContainer);

	                var unit = $this.attr(opts.attributes.unit);
	                var quantity = $this.find(qntInput).val();

	                function roundByIncrement(number, increment) {
					    return Math.ceil((number) / increment ) * increment ;
					}

                	 // var upText = parseFloat(quantity) + parseFloat(quantityIncrement);
                	// console.log('indexOf '+quantity.indexOf("."));

                	if(quantity.indexOf(".") !== -1 ) {
   						
						var quantityIncrement = $this.attr(opts.attributes.quantityIncrement);
						// alert(quantityIncrement);
						if(quantityIncrement.indexOf(".") !== -1 ) {

							var quantity = roundByIncrement(quantity, quantityIncrement);
							// console.log(quantity);
							// var quantity = parseFloat(quantity);
						}

	                }

	                if(parseFloat(quantity) >= parseFloat(quantityMin) && parseFloat(quantity) <= parseFloat(quantityMax) ) {

	                	$this.find(qntInput).val(quantity);
	                	$this.find(qntSpan).html(quantity+unit);
	                	// plugin.updateQuantity(quantity, productCode); Replaced to Callback

	                	opts.add($product, quantity, plugin.callback);
	                }else {

	                	if(parseFloat(quantity) < parseFloat(quantityMin)) {
	                		$this.find(qntInput).val(quantityMin);
	                		$this.find(qntSpan).html(quantityMin+unit);

	                		// plugin.updateQuantity(quantityMin, productCode); Replaced to Callback

	                		opts.add(product, quantityMin, plugin.callback);
	                		// console.log(quantityMin);
	                		// alert('Sorry minimum quantity:'+quantityMin+unit);
	                	}else if(parseFloat(quantity) > parseFloat(quantityMax)) {
	                		$this.find(qntInput).val(quantityMax);
	                		$this.find(qntSpan).html(quantityMax+unit);

	                		// plugin.updateQuantity(quantityMax, productCode); Replaced to Callback
	                		
	                		opts.add(product, quantityMax, plugin.callback);
	                		// console.log(quantityMax);
	                		// alert('Sorry maximum quantity:'+quantityMax+unit);
	                	}
	                }

	                itemNotInBasketContainer.removeClass('show').addClass('hide');
                	itemInBasketContainer.removeClass('hide').addClass('show');
                	
	                // plugin.callback(productCode, quantity, callback);
	                

	                return false;

	            });

			},
			updateSpanQnt: function(qnt, qntSpan, unit){
				var $this  = $(this.element),
	                $qntSpan = $this.find(qntSpan);
	             var $unit = '<small>'+unit+'</small>';
				$($qntSpan).html(qnt + $unit);
				return false;
			},
			updateQuantity: function(qnt, productCode){
				var opts = this.options,
	                $this  = $(this.element);

				var quantity = $this.attr(opts.attributes.quantity, qnt);
				return false;
				// console.log(productCode+','+ qnt);
			},
			changeProduct: function(quantityUp, quantityDown, productCode, quantity, qntSpan, quantityMin, quantityMax, unit){
				var $this = $(this.element);
				var plugin = this;
				var opts = this.options;
				var product = {};
				// var product = [];
				plugin.genProductData(product,productCode, unit, $this);

				$this.on('click', quantityUp, function(e){
	                e.preventDefault();

	                var quantity = $this.attr(opts.attributes.quantity);
	                var quantityIncrement = $this.attr(opts.attributes.quantityIncrement);

	                if(parseFloat(quantity) < parseFloat(quantityMax) ) {
		                // var upText = parseFloat(quantity) + 1;
		                var upText = parseFloat(quantity) + parseFloat(quantityIncrement);

		                if(quantityIncrement.indexOf('.') !== -1 ) {

		                	// console.log(quantityIncrement.split(".")[1].length);
		                	var deximalNumber = quantityIncrement.split(".")[1].length;

		                	var upText = upText.toFixed(deximalNumber);
		                }
	                	
		                console.log(upText);

						plugin.updateSpanQnt(upText, qntSpan, unit);
						// plugin.updateQuantity(upText, productCode); Replaced to Callback

						// plugin.callback(productCode, quantity, 'change');
						opts.change(product, upText, plugin.callback);

					}else {
						alert('Sorry maximum quantity:'+quantityMax+unit);
					}
					return false;
	            });
	            $this.on('click', quantityDown, function(e){
	                e.preventDefault();

	                var quantity = $this.attr(opts.attributes.quantity);
	                var quantityIncrement = $this.attr(opts.attributes.quantityIncrement);
	                if(quantity > quantityMin) {
		                // var downText = parseFloat(quantity) - 1;
		                var downText = parseFloat(quantity) - quantityIncrement;

		                if(quantityIncrement.indexOf('.') !== -1 ) {
		                	var downText = downText.toFixed(1);
		                }

		                console.log('Min Qty: '+quantityMin);

                		plugin.updateSpanQnt(downText, qntSpan, unit);
						// plugin.updateQuantity(downText, productCode); Replaced to Callback


						// plugin.callback(productCode, quantity, 'change');
						opts.change(product, downText, plugin.callback);
					}else {
						alert('Sorry minimum quantity:'+quantityMin+unit);
					}
					return false;
	            });

			},
			deleteProduct: function( deleteProduct, productCode, quantity, qntSpan, qntInput, quantityMin, unit){
				var opts = this.options;
				var $this = $(this.element);
				var plugin = this;
				var product = {};
				// var product = [];
				plugin.genProductData(product,productCode, unit, $this);
				
				$this.on('click', deleteProduct, function(e){
	                e.preventDefault();

	                var quantity = $this.attr(opts.attributes.quantity);
	                
	                console.log('delete '+quantity+' quantity, productCode '+productCode);

	                var quantity = defaults.quantity;
	                $this.find(qntInput).val(quantity);

	                var itemInBasketContainer = opts.selectors.itemInBasketContainer,
	                	itemNotInBasketContainer = opts.selectors.itemNotInBasketContainer;

	                var itemInBasketContainer = $this.find(itemInBasketContainer),
	                	itemNotInBasketContainer = $this.find(itemNotInBasketContainer);

	                // plugin.updateQuantity(quantity, productCode, unit); Replaced to Callback
	                itemNotInBasketContainer.removeClass('hide').addClass('show');
                	itemInBasketContainer.removeClass('show').addClass('hide');

	                // plugin.init();
	                $this.removeData();
	                opts.delete(product, plugin.callback);

	                
	            });

			},
			loadBasketBlock: function( el, quantity, quantityMin, unit, qntSpan, qntInput, itemInBasketContainer, itemNotInBasketContainer) {
				var plugin = this;
				var $this = $(this.element);

                var itemInBasketContainer = $this.find(itemInBasketContainer),
                	itemNotInBasketContainer = $this.find(itemNotInBasketContainer);

				if(quantity < quantityMin) {
					itemNotInBasketContainer.removeClass('hide').addClass('show');
                	itemInBasketContainer.removeClass('show').addClass('hide');
				}else {
					itemNotInBasketContainer.removeClass('show').addClass('hide');
                	itemInBasketContainer.removeClass('hide').addClass('show');
	            }

				return false;
				
			},
			getChecked: function( addAllProducts, selected ) {
				var opts = this.options,
					plugin = this,
					$this = $(this.element),
					$table = $this.parents('.Table');
					

				function createJSON(checkedItems, selector) {
					var jsonObj = [];
					$(checkedItems).each(function() {
						var $row = $(this).parents('.Row');
						var $items = $row.find('.product-list-item');

						// var quantity = $items.find("#quantity").val();
						var quantity = $items.attr('data-basketquantity');
						var productCode = $items.attr('data-productcode');
						
						$items.attr('data-basketquantity', quantity);

				        var item = {}
				        item ["qty"] = quantity;
				        item ["productCode"] = productCode;

				        jsonObj.push(item);
				    });
					console.log(jsonObj);
					
					opts.addAll(jsonObj, selector, plugin.callback);
				}

				$table.on('click', addAllProducts[0], function(e){
					e.preventDefault();

					var selector = addAllProducts[0];
					var checkInBody = $table.find('.Tbody');

					var checkedItems = checkInBody.find(selected);
					
					// console.log(checkedItems.length);
					if(checkedItems.length !== 0) {
						createJSON(checkedItems, selector);
					}
				});

				$table.on('click', addAllProducts[1], function(e){
					e.preventDefault();

					var selector = addAllProducts[1];
					var checkInBody = $table.find('.Tbody');
					var checkedItems = checkInBody.find(selected);
					
					// console.log(checkedItems.length);
					if(checkedItems.length !== 0) {
						createJSON(checkedItems, selector);
					}
					
				});

			},
			callback: function(isComplete) {
				if (true === isComplete) {
					
	                console.log('callback True');
	                return true;
	            }
	            else {
	            	console.log('callback False');
	                return false;
	            }
	        }

		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );