
/**
 *
 *  !!!! IMPORTANT !!!!!!
 *
 *  ENSURE THAT THE VARIABLE ES_CONFIG IS A VALID JSON OBJECT AND IS ERROR-FREE.
 */

var ES_CONFIG = {
    url: "http://localhost:9200",
    index_name: "spam_dataset",
    type: "document",
    query: {
        "match_phrase": {"body": "good"}
    },
    keys: [
        {
            "name": "body",
            "is_readonly": false
        },
        {
            "name": "is_spam",
            "is_readonly": false,
            "values": ["spam", "ham"],
            "option": "dropdown"
        },
        {
            "name": "split",
            "is_readonly": true,
            "values": ["train", "test"],
            "option": "radio"
        },
        {
            "name": "subject",
            "is_readonly": false
        }
    ]
};

/**
 * ***********************************************************************
 * ************************************************************************
 *
 * KEY FORMAT
 *
 *   The variable ES_CONFIG is to have a field named 'keys',
 *   which is an array of keys from the ElasticSearch index
 *   displayed by index.html
 *
 *   The following section describes the format of each element
 *   of the `keys` array.
 *   */

/*

 {
 name: "NAME_OF_THE_KEY",        // required
 is_readonly: true/false,        // optional - if missing, the field is considered editable
 option: "TYPE_OF_OPTION",       // optional - possible values "dropdown" and "radio"
                                 //            if the option key is missing, the
                                 //            field is displayed as text
 values: ["option1", "option2"], // optional - has effect only if option = radio or dropdown
 }


 */

/* ************************************************************************
 * ************************************************************************
 */
