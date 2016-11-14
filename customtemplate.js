jQuery(document).ready(function($) {

    $('#_cmb_page_intro_area').addClass('closed');

    //add titles to the content block h3s
    $('#_cmb_page_content_blocks_box .cmb-repeatable-grouping').filter(function(index) {

        var select = $(this).find('#_cmb_page_content_blocks_group_' + index + '_cmb_group_item_select');
        var contentBlockTitle = $(this).find('#_cmb_page_content_blocks_group_' + index  + '__cmb_page_' + select.val() + '_text');

        if(select.val() === 'modalwindow'){
            $('h3', $(this)).append('  --  Title:   ' + 'Modal Window');
        }else{
            if(typeof contentBlockTitle.val() != 'undefined' && contentBlockTitle.val().length ){
                $('h3', $(this)).append('  --  Title:   ' + contentBlockTitle.val());
            }
        }

        //adding the id  for the jquery sortable to update order
        $(this).attr('id', 'foo_' + $(this).data('iterator'));

    });

    //if its the first item in a repeatable group and you don't add a title open the collapsed element to indicate you need to add one otherwise you'll wonder why update doens't work.
    $('body #_cmb_page_content_blocks_group_0__cmb_page_pattern1_text').bind('invalid', function(e){
        //console.log('yes it is rather.');
        $(this).closest('.cmb-repeatable-grouping').removeClass('closed');
    });

    //on load we need to show the selected pattern and hide all the rest
    arr = ['pattern1', 'pattern2', 'pattern3a', 'pattern3b', 'customcontentblock', 'modalwindow'];
    $("body .cmb2_select[data-pattern='pattern-select']").each(function(index, el) {
        $thisSelect = $(el);
        //get the wrapper div of the field rows
        var parentGrouping = $thisSelect.closest('.cmb-repeatable-grouping .cmb-field-list');
        arr.forEach(function(entry) {
            if (entry === $thisSelect.val()) {
                var patternClass = $thisSelect.val();
                //find the rows with a class that matches the selected value
                var patternElementsToShow = parentGrouping.find("." + patternClass);
                //show them
                patternElementsToShow.show();
                //for the actual inputs
                var $inputsModsShow = patternElementsToShow.find(".cmb-td").children();
                $inputsModsShow.each(function(index, el) {
                    //we don't want to disable buttons
                    if ($(el).attr('type') != 'button') {
                        //enable all these inputs
                        $(el).prop('disabled', false);
                        //make the title required
                        if ($(el).parent().parent().hasClass('box-title')) {
                            $(el).prop('required', true);
                        }
                    }
                });
            } else {
                var patternElementsToHide = parentGrouping.find("." + entry);
                var $inputModsHide = patternElementsToHide.find(".cmb-td").children();
                $inputModsHide.each(function(index, el) {
                    if ($(el).attr('type') != 'button') {
                        $(el).prop('disabled', true);
                        $(el).prop('required', false);
                    }
                });
                patternElementsToHide.hide();
            }
        });
    });


    //hide the pattern 1 media type options on document load
    $("body .pattern1-media-type > .cmb-td > .cmb2_select").each(function(index, el) {
        //this instance of a select
        $thisSelect = $(el);
        var parentGrouping = $thisSelect.closest('.cmb-repeatable-grouping .cmb-field-list');
        if ($thisSelect.val() == 'image') {
            parentGrouping.find('.pattern1-video').hide();
            parentGrouping.find('.pattern1-video > .cmb-td input').prop('disabled', true);
            var parentPattern = parentGrouping.find("[data-pattern='pattern-select']").val();
            //only show this if we are inside pattern one
            if (parentPattern == 'pattern1') {
                parentGrouping.find('.pattern1-image').show();
            }
            parentGrouping.find('.pattern1-image > .cmb-td input').prop('disabled', false);
        } else if ($thisSelect.val() == 'video') {
            parentGrouping.find('.pattern1-video').show();
            parentGrouping.find('.pattern1-video > .cmb-td input').prop('disabled', false);
            parentGrouping.find('.pattern1-image').hide();
            parentGrouping.find('.pattern1-image > .cmb-td input').prop('disabled', true);
        }
    });

    $('body').on('change', ".cmb2_select[data-pattern='pattern-select']", function(event) {
        event.preventDefault();
        var select = $(this);
        //selected pattern
        var selectedVal = select.val();
        //get the wrapper div of the field rows
        var parentGrouping = select.closest('.cmb-repeatable-grouping .cmb-field-list');
        parentGrouping.find('.custom-input').filter(function(_index, e) {
            if (!$(e).hasClass('.' + selectedVal)) {
                $(e).closest('.cmb-row').hide();
                var $fieldElements = $(e).find('.cmb-td').children();
                $fieldElements.each(function(index, el) {
                    if ($(el).attr('type') != 'button') {
                        $(el).prop('disabled', true);
                        $(el).prop('required', false);
                    }
                });
                $(e).find('.cmb-td ul.cmb-attach-list').empty();
            }
        });
        parentGrouping.find("." + selectedVal).each(function(index, el) {
            var $row = $(el).closest('.cmb-row');
            //show the row
            $row.show();
            var $fieldElements = $row.find('.cmb-td').children();
            $inputs = $row.find('input');
            if($row.hasClass('box-title')){
                console.log('boom shake shake shake the room');
                $row.find('input').prop('required', true);
            }
            $fieldElements.each(function(index, el) {
                //inputs inside cmb-td
                $innerInput = $(el);
                if ($innerInput.attr('type') != 'button') {
                    $innerInput.prop('disabled', false);
                }
            });
        });
    });


    $('body').on('change', ".pattern1-media-type .cmb-td .cmb2_select", function(event) {
        var parentGrouping = $(this).closest('.cmb-repeatable-grouping .cmb-field-list');
        if ($(this).val() == 'image') {
            parentGrouping.find('.pattern1-video').hide();
            parentGrouping.find('.pattern1-video > .cmb-td input').prop('disabled', true);
            parentGrouping.find('.pattern1-image').show();
            parentGrouping.find('.pattern1-image > .cmb-td input').prop('disabled', false);
        } else if ($(this).val() == 'video') {
            parentGrouping.find('.pattern1-video').show();
            parentGrouping.find('.pattern1-video > .cmb-td input').prop('disabled', false);
            parentGrouping.find('.pattern1-image').hide();
            parentGrouping.find('.pattern1-image > .cmb-td input').prop('disabled', true);
        }
    });

});