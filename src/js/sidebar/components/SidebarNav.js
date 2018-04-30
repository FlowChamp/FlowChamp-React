import React, { Component } from 'react';
import { ArrowLeft, Menu, Settings, User, UserMinus } from 'react-feather';
import UserManager from '../../UserManager';

export default class SidebarNav extends Component {
   handleEvent = options => {
      this.props.onEvent(options);
   }

   closeSidebar = () => {
      this.handleEvent({
         type: 'sidebar',
         action: 'toggle'
      });
   }

   openSettings = () => {
      this.handleEvent({
         type: 'change-view',
         value: 'settings',
      });
   }

   popViewStack = () => {
      this.handleEvent({
         type: 'pop-view'
      });
   }

   loginView = () => {
      this.handleEvent({
         type: 'change-view',
         value: 'login',
         route: 'empty-views',
      });
   }

   logOut = () => {
      const config = this.props.user.config;

      UserManager.logOut(config).then(() => {
         localStorage.removeItem('flowChampConfig');
         window.location.reload();
      }).catch(e => {
         console.log("Error: couldn't log out: ", e);
      });
   }

   BackButton = () => {
      return this.props.viewStack.length > 1 ?
         <ArrowLeft className="sidebar-nav-icon back-icon"
            onClick={this.popViewStack} /> : '';
   }

   LoginLogoutButton = () => {
      if (!this.props.user.requireAuth) return null;
      return this.props.user.isLoggedIn ?
         <UserMinus className="sidebar-nav-icon"
            onClick={this.logOut}/> :
         <User className="sidebar-nav-icon" onClick={this.loginView} />;
   }

   render() {
      return (
         <div className="sidebar-nav-container">
            <div className="left-nav-container">
               <Menu className="menu-icon" onClick={this.closeSidebar}/>
               {this.BackButton()}
            </div>
            <div className={`right-nav-container ${this.props.viewStack.length > 1 ? 'invisible' : ''}`}>
               <Settings className="sidebar-nav-icon" onClick={this.openSettings}/>
               {this.LoginLogoutButton()}
            </div>
         </div>
      );
   }
}
