/*****************************
 * 
 * Created by Lorenz Schäfer
 * lorenzschaefer@gmx.ch
 *
 */

(function( $ ) {

   $.fn.colorSelect = function() {
		
		if (!this.is('select')){
			return false;
		}
		var select = this;
		select.hide();
		
		var multiple = select.prop('multiple');
		
		// invokes the createGroup method, treating the select element like an optgroup. Then changes the class to container.
		var container = createGroup(select)
			.removeClass('color-select-optgroup')
			.addClass('color-select-container')
			.insertAfter(select);
		
		// when the selected value changed
 		select.change(function(){
			container.find('.color-select-option')
				.removeClass('color-select-option-selected');
				
			select.find(':selected').each(function(){
				container.find('.color-select-option[data-color = "'+$(this).attr('value')+'"]')
				.addClass('color-select-option-selected');
					
			});
		});
		
		// call onChange for initialization
		select.change();
		
		return this;
		
		
		// takes an element (select or optgroup) and returns a tree of divs.
		function createGroup(parent){
			var children = parent.children();
			var group = $('<div class="color-select-optgroup" />');
			children.each(function(){
				if ($(this).is('optgroup')){
					createGroup($(this)).appendTo(group);
				}
				if ($(this).is('option')){
					createOption($(this)).appendTo(group);
				}
			});
			return group;
		}
		
		// takes an element (option) and returns a div with the background-color set to the options value.
		function createOption(option){
			var color = option.attr('value');
			
			return $('<div class="color-select-option" />')
				.css('background-color', color)
				.attr('data-color', color)
				
				// when clicked on the div, change the select element's value. this will then invoke the select.change() mehtod.
				.click(function(){
					if (multiple) {
						select.find('option[value="'+color+'"]').prop('selected', function(i, v){ return !v; });
					}
					else {
						select.val(color);
					}
					select.change();
				});
			
		}
		
				

	};

}( jQuery ));