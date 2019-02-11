import React from 'react';
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import '../assets/css/AutocompleteInput.css';

const Item = ({ entity: { displayName }}) => { return (<div> {displayName} </div>) }
const Loading = ({data}) => ( <div> Loading </div> );

class AutocompleteInput extends React.Component {
    render() {
        var trigger = {
            "@": {
                dataProvider: token => {
                    return [
                        { displayName: "Tom" },
                        { displayName: "Fred" },
                        { displayName: "Cindy" },
                    ]
                },
                component: Item,
                output: ( item, trigger ) => { return item.displayName }
            }
        }

        return (
            <div className="AutocompleteInputContainer">
                <ReactTextareaAutocomplete trigger={trigger} loadingComponent={Loading}/>
            </div>
        )
    }
}

export default AutocompleteInput;