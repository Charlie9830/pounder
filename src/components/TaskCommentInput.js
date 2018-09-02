import React from 'react';
import Button from './Button';
import '../assets/css/TaskCommentInput.css'
import ReactTextAreaAutocomplete from "@webscopeio/react-textarea-autocomplete";

const Item = ({ entity: { displayName }, selected: { isSelected } }) =>
 <div className="TaskCommentAutocompleteItem" data-selected={isSelected}> {displayName} </div>;

class TaskCommentInput extends React.Component {
    constructor(props) {
        super(props);

        // Refs.
        this.autocompleteTextAreaRef = null;

        // Method Bindings.
        this.handleCommentButtonClick = this.handleCommentButtonClick.bind(this);
    }

    render() {
        const autoCompleteTrigger = {
            "@": {
                dataProvider: token => {
                    return this.props.projectMembers.map(member => {
                        return { displayName: member.displayName }
                    })
                },
                component: Item,
                output: (item, trigger) => item.displayName,
            }
        }

        return (
                <div className="TaskCommentInputGrid">
                    <div className="TaskCommentInputTextContainer">
                        <ReactTextAreaAutocomplete className="TaskCommentInputTextArea"
                        loadingComponent={() => <span>Loading</span>}
                        trigger={autoCompleteTrigger}
                        innerRef={(textArea) => {this.autocompleteTextAreaRef = textArea}}
                        minChar={0}
                        movePopupAsYouType={true}
                        dropdownClassName="TaskCommentAutocompleteDropdown"/>
                    </div>

                    <div className="TaskCommentInputButtonContainer">
                        <Button text="Comment" size="small" onClick={this.handleCommentButtonClick}/>
                    </div>
                </div>
        )
    }

    handleCommentButtonClick() {
        if (this.autocompleteTextAreaRefTextAreaRef !== null) {
            var value = this.autocompleteTextAreaRef.value;
            if (value !== "") {
                this.props.onNewComment(value);
            }
        }
        
    }
}

export default TaskCommentInput;