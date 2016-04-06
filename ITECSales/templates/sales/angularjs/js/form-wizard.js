var FormWizard = function () {
    var wizard = function (current) {
        function format(state) {
            if (!state.id) return state.text; // optgroup
            return "<img class='flag' src='../../../assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
        }

        $("#country_list").select2({
            placeholder: "Select",
            allowClear: true,
            formatResult: format,
            formatSelection: format,
            escapeMarkup: function (m) {
                return m;
            }
        });


        var handleTitle = function(tab, navigation, index) {
            var total = navigation.find('li').length;
            //$('.step-title', $('#form_wizard_1')).text('Step ' + (current) + ' of ' + total);
            var li_list = navigation.find('li');
            for (var i = 0; i < current; i++) {
                jQuery(li_list[i]).addClass("done");
            }

            Metronic.scrollTo($('.page-title'));
        };

        // default form wizard
        $('#form_wizard_1').bootstrapWizard({
            'nextSelector': '.button-next',
            'previousSelector': '.button-previous',
            onTabClick: function (tab, navigation, index, clickedIndex) {
                return false;
                /*
                 success.hide();
                 error.hide();
                 if (form.valid() == false) {
                 return false;
                 }
                 handleTitle(tab, navigation, clickedIndex);
                 */
            },

            onTabShow: function (tab, navigation, index) {
                var total = navigation.find('li').length;
                //current = index + 1;
                var $percent = (current / total) * 100;
                $('#form_wizard_1').find('.progress-bar').css({
                    width: $percent + '%'
                });
                handleTitle(tab, navigation, index);
            }
        });

        $('#form_wizard_1').find('.button-previous').hide();
        $('#form_wizard_1 .button-submit').click(function () {
            //alert('Finished! Hope you like it :)');
        }).hide();
    };

    return {
        //main function to initiate the module
        init: function (current) {
            wizard(current);
        }
    };

}();