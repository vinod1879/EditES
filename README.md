# EditES

 # KEY FORMAT

 *   The variable ES_CONFIG is to have a field named 'keys',
 *   which is an array of keys from the ElasticSearch index
 *   displayed by index.html
 *
 *   The following section describes the format of each element
 *   of the `keys` array.
 * 
 
      
      {
        name: "NAME_OF_THE_KEY",        // required
      
        is_readonly: true/false,        // optional - if missing, the field is considered editable
      
        option: "TYPE_OF_OPTION",       // optional - possible values "dropdown" and "radio"
                                        //            if the option key is missing, the
                                        //            field is displayed as text
      
        values: ["option1", "option2"], // optional - has effect only if option = radio or dropdown
      }
