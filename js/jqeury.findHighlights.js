/**
 * Created by vinodvishwanath on 26/09/18.
 */
jQuery.fn.findHighlights = function(keywords) {
    return this.each(function() {

        var ininitalHeight, currentRow, iteration = 0;
        var highlightArray = [];
        var highlightIndex = -1;
        var textarea = this;

        var getKeywordPositions = function (text) {
            var positions = [];
            for(var i = 0; i < keywords.length; i += 1) {
                var curWord = keywords[i];
                var index = -1;
                while (true) {
                    index = text.indexOf(curWord, index + 1);
                    if (index != -1) {
                        positions.push({start: index, end: index + curWord.length});
                    }
                    else {
                        break;
                    }
                }
            }
            positions = positions.sort(function(a, b){return a.start-b.start});
            return positions;
        };

        var highlightNext = function () {
            updateIndex(1);
        };

        var highlightPrev = function () {
            updateIndex(-1);
        };

        var updateIndex = function (delta) {
            var array = highlightArray;
            var index = highlightIndex + delta;
            if (index + delta < 0) {
                index = array.length - 1;
            }
            else if (index + delta >= array.length) {
                index = 0;
            }
            highlightIndex = index;
            var position = array[index];

            highlightPosition(position);
        };

        var highlightPosition = function (position) {

            var content = textarea.value.substring(0, position.start);
            sendContentToMirror(content);
            calculateRowNumber(position);
        };

        var createMirror = function(textarea) {
            jQuery(textarea).after('<div class="autogrow-textarea-mirror"></div>');
            return jQuery(textarea).next('.autogrow-textarea-mirror')[0];
        };

        var sendContentToMirror = function (content) {
            mirror.innerHTML = content.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br />') + '.<br/>.';
        };

        var growTextarea = function (ev) {

            if (ev.key == "ArrowLeft" || ev.which == 37) {
                console.log('Left');
                highlightPrev();
            }
            else if (ev.key === "ArrowRight" || ev.which == 39) {
                console.log('Right');
                highlightNext();
            }
        };

        var updateScrollDictionary = function () {
            var text = String(textarea.value);
            var arr = getKeywordPositions(text);

            if (arr && arr.length > 0) {
                highlightArray = arr;
                highlightIndex = 0;
            }
        };

        var calculateRowNumber = function (position) {
            if(iteration===0){
                ininitalHeight = $(mirror).height();
                currentHeight = ininitalHeight;
                iteration++;
            }
            else{
                currentHeight = $(mirror).height();
            }

            currentRow = (currentHeight/(ininitalHeight/2) - 1) * 2;
            var line_ht = jQuery(textarea).css('line-height').replace('px',''); //height in pixel of each row
            jQuery(textarea).scrollTop((currentRow)*line_ht); // scroll to the selected line
        };

        // Create a mirror
        var mirror = createMirror(this);

        // Style the mirror
        mirror.style.display = 'none';
        mirror.style.wordWrap = 'break-word';
        mirror.style.whiteSpace = 'normal';
        mirror.style.padding = jQuery(this).css('padding');
        mirror.style.width = jQuery(this).css('width');
        mirror.style.fontFamily = jQuery(this).css('font-family');
        mirror.style.fontSize = jQuery(this).css('font-size');
        mirror.style.lineHeight = jQuery(this).css('line-height');

        // Style the textarea
        this.style.overflow = "hidden";
        this.style.minHeight = this.rows+"em";

        var ininitalHeight = $(mirror).height();

        // Bind the textarea's event
        this.onkeyup = growTextarea;

        updateScrollDictionary();
    });
};
