import React from 'react';
import '../../assets/css/AppSettingsMenu/AppSettingsSidebar.css';
class AppSettingsSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isCollapsed: false,
        }

        // Method Bindings.
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    render() {
        return (
            <div className="AppSettingsSidebarFlexContainer">
                { /* General */}
                <div className="AppSettingsSidebarItemContainer" onClick={() => this.handleItemClick("general")}>
                    <div>
                        <label className="AppSettingsSidebarItemLabel" data-isselected={this.props.menuPage === "general"}>
                            General
                        </label>
                    </div>
                </div>

                { /* Account */}
                <div className="AppSettingsSidebarItemContainer" onClick={() => this.handleItemClick("account")}>
                    <div>
                        <label className="AppSettingsSidebarItemLabel" data-isselected={this.props.menuPage === "account"}>
                            Account
                        </label>
                    </div>
                </div>

                { /* About */}
                <div className="AppSettingsSidebarItemContainer" onClick={() => this.handleItemClick("about")}>
                    <div>
                        <label className="AppSettingsSidebarItemLabel" data-isselected={this.props.menuPage === "about"}>
                            About
                        </label>
                    </div>
                </div>
            </div>
        )    
    }

    handleItemClick(item) {
        this.props.onItemClick(item);
    }
}

export default AppSettingsSidebar