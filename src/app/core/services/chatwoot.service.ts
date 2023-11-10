import { inject, Injectable } from '@angular/core';
import { enc, HmacSHA256 } from 'crypto-js';
import { NGXLogger } from 'ngx-logger';
import { IbUserModel } from '../../modules/auth/models/ib-user.model';
import { UserDataService } from './user-data.service';

interface ChatwootSettings {
  hideMessageBubble?: boolean;
  position?: 'left' | 'right';
  locale?: 'en';
  useBrowserLanguage?: boolean;
  type?: 'standard' | 'expanded_bubble';
  darkMode?: 'light' | 'auto';
  launcherTitle?: string;
  showPopoutButton?: boolean;
  preChatForm?: any;
}
export interface ChatWootWindow extends Window {
  $chatwoot: any;
  chatwootSettings: ChatwootSettings;
}

declare var window: ChatWootWindow;

const defaultChatwootSetting: ChatwootSettings = {
  position: 'right',
  type: 'expanded_bubble',
  launcherTitle: 'Lets Chat',
  hideMessageBubble: true,
  useBrowserLanguage: false,
  darkMode: 'light',
  locale: 'en',
  showPopoutButton: true,
};

@Injectable({
  providedIn: 'root',
})
export class ChatwootService {
  private loggedUserData: IbUserModel;

  private readonly logger = inject(NGXLogger);

  constructor(private userDataService: UserDataService) {
    this.logger.trace('chatwoot initialization started');
    this.initChatwoot();
    this.logger.trace('chatwoot instance created');
    // this.initChatwoot();
  }

  public initChatwoot(settings: ChatwootSettings = defaultChatwootSetting) {
    // Assign a new object to the 'chatwootSettings' property of the window object
    // window.chatwootSettings = {
    //   // Spread operator is used here to merge two objects.
    //   // The first object contains default Chatwoot settings, while the second object contains any user-defined settings.
    //   ...defaultChatwootSetting,
    //   ...settings,
    // };
    // This is an IIFE (Immediately Invoked Function Expression), which takes two arguments: 'document' and 'script'.
    // It allows us to define a function and execute it immediately, without having to store it in a separate variable.
    // (function (d, t) {
    //   // Get the Chatwoot API base URL from the environment file
    //   let BASE_URL = environment.chatwoot.apiUrl;
    //   let WEBSITE_TOKEN = environment.chatwoot.token;
    //   // Create a new script element and assign it to 'g'
    //   let g: any = d.createElement(t);
    //   // Get the first script element on the page and assign it to 's'
    //   let s: any = d.getElementsByTagName(t)[0];
    //   // Get the window object and assign it to 'w'
    //   let w: any = window;
    //   // Set the src attribute of the script element to the Chatwoot SDK url
    //   g.src = BASE_URL + '/packs/js/sdk.js';
    //   // Set the 'defer' and 'async' attributes of the script element to true
    //   g.defer = true;
    //   g.async = true;
    //   // Insert the script element before the first script element on the page
    //   s.parentNode.insertBefore(g, s);
    //   // Add an event listener to the script element for when it has finished loading
    //   g.onload = function () {
    //     // Call the 'run' function of the ChatwootSDK object with the websiteToken and baseUrl options
    //     w.chatwootSDK.run({
    //       websiteToken: WEBSITE_TOKEN,
    //       baseUrl: BASE_URL,
    //     });
    //   };
    // })(document, 'script');
    // Adds an event listener for when the 'chatwoot:ready' event is fired
    // When the event is fired, it logs a message indicating that Chatwoot is initialized
    // window.addEventListener('chatwoot:ready', () => {
    //   // console.log('Chatwoot is initialized');
    // });
    // // Adds an event listener for when the 'chatwoot:on-message' event is fired
    // // When the event is fired, it logs a message indicating that a Chatwoot message is being sent/received
    // window.addEventListener('chatwoot:on-message', () => {
    //   // console.log('Chatwoot message is going on');
    // });
    // // Adds an event listener for when the 'chatwoot:error' event is fired
    // // When the event is fired, it logs an error message with the value of the error object passed as argument to the function
    // window.addEventListener('chatwoot:error', function (e) {
    //   // console.log('Got Error From Chatwoot: ', e);
    // });
  }

  /**
   * This method shows the Chatwoot chat window
   */
  public showChatwoot() {
    // this.tryCatchHelper(() => {
    //   // Optional: This code sets the authorized user
    //   // this.setAuthorizedUser();
    //   window.$chatwoot.toggleBubbleVisibility('show');
    // });
  }

  /**
   * This method hides the Chatwoot chat window
   */
  public hideChatwoot() {
    // this.tryCatchHelper(() => {
    //   window.$chatwoot.toggleBubbleVisibility('hide');
    // });
  }

  /**
   * This method pops out the Chatwoot chat window
   */
  public popoutChatwoot() {
    // Calls the tryCatchHelper function and executes the popoutChatWindow function
    // this.tryCatchHelper(() => {
    //   window.$chatwoot.popoutChatWindow();
    // });
  }

  /**
   * This method toggles Chatwoot based on the state passed as a parameter
   * @param state - can be 'open', 'close', or null (default)
   * 'open' - opens the Chatwoot widget
   * 'close' - closes the Chatwoot widget
   * null - toggles the Chatwoot widget (if it is open, it closes; if it is closed, it opens)
   */
  public toggleChatwoot(state: 'open' | 'close' | null = null) {
    // // If state is not null, set the Chatwoot widget to the specified state
    // if (state) {
    //   this.tryCatchHelper(() => {
    //     window.$chatwoot.toggle(state);
    //   });
    // }
    // // If state is null, toggle the Chatwoot widget
    // else {
    //   this.tryCatchHelper(() => {
    //     window.$chatwoot.toggle();
    //   });
    // }
  }

  /**
   * This method sets the user details required by Chatwoot
   */
  public setDefaultUser() {
    // Set the user-related properties for Chatwoot
    // The tryCatchHelper method is used to handle errors gracefully
    // The first parameter of the setUser method is the loginId for the user
    // The second parameter is an object containing the user's email, name, avatar_url and phone_number
    // this.tryCatchHelper(() => {
    //   window.$chatwoot.setUser('new-user', {});
    // });
  }

  /**
   * This method sets the authorized user information in chatwoot
   */
  public setAuthorizedUser() {
    // try {
    //   this.tryCatchHelper(() => {
    //     // Get logged user data from the userDataService
    //     this.loggedUserData = this.userDataService.getUserData();
    //     // Retrieve loginId, fullName, mobileNumber, email and custId from loggedUserData
    //     const { loginId } = this.loggedUserData.genericServiceBean.newLoginBean;
    //     const {
    //       custName: fullName,
    //       mobileNumber,
    //       alertEmail: email,
    //       custId,
    //     } = this.loggedUserData.genericServiceBean.newLoginBean.doMobeeCustomer;
    //     // Set userIdentityValidation
    //     const userIdentityValidation = environment.chatwoot.userIdentificationToken;
    //     // Generate hmacKey using generateHMAC method with loginId and userIdentityValidation
    //     const hmacKey = this.generateHMAC(userIdentityValidation, loginId);
    //     // Set user-related properties required by Chatwoot
    //     // window.$chatwoot.setAttribute({
    //     //   select_country_code: 'Botswana',
    //     // });
    //     window.$chatwoot.setUser(loginId, {
    //       name: fullName || 'N.A', // Name of the user
    //       avatar_url: `https://i.pravatar.cc/150?u=${loginId}`, // Avatar URL
    //       email: email || 'N.A', // Email of the user
    //       identifier_hash: hmacKey, // Identifier Hash generated based on the webwidget hmac_token
    //       phone_number: '+' + mobileNumber, // Phone Number of the user
    //       description: `Customer ID: ${custId} \n BP Number: N.A`, // Description about the user
    //       // country_code: 'BLR', // Two letter country code
    //       // select_country_code: 'Botswana',
    //       // city: 'Bengaluru', // City of the user
    //       company_name: 'CEDA Online Services', // Company name
    //       social_profiles: {
    //         twitter: 'NA', // Twitter user name
    //         linkedin: 'NA', // LinkedIn user name
    //         facebook: 'NA', // Facebook user name
    //         github: 'NA', // Github user name
    //       },
    //     });
    //   });
    // } catch {
    //   console.log('User not logged in');
    // }
  }

  /**
   * This method sets a label for the current Chatwoot conversation.
   *
   * @param label - A string representing the name of the label to be set.
   *
   */
  public setLabel(label: string) {
    // Call tryCatchHelper to handle any errors that occur within this method's function body.
    // this.tryCatchHelper(() => {
    //   // Use the '$chatwoot' global object to call its 'setLabel' function, which sets the specified label
    //   // for the current conversation.
    //   window.$chatwoot.setLabel(label);
    // });
  }

  /**
   * This method removes a label from the Chatwoot conversation.
   *
   * @param label - A string representing the name of the label to be removed.
   *
   */
  public removeLabel(label: string) {
    // Call tryCatchHelper to handle any errors that occur within this method's function body.
    // this.tryCatchHelper(() => {
    //   // Use the '$chatwoot' global object to call its 'removeLabel' function, which removes the specified label
    //   // from the current conversation.
    //   window.$chatwoot.removeLabel(label);
    // });
  }

  /**
   * This method resets the Chatwoot session.
   *
   * A session is a period of time during which a user interacts with the Chatwoot widget on the website.
   * Resetting the session clears any existing conversation data and starts a new session.
   *
   */
  public resetChatwootSession() {
    // Call tryCatchHelper to handle any errors that occur within this method's function body.
    // this.tryCatchHelper(() => {
    //   // Use the '$chatwoot' global object to call its 'reset' function, which clears existing conversation data and
    //   // starts a new session.
    //   window.$chatwoot.reset();
    // });
  }

  /**
   * This method sets the language for Chatwoot.
   *
   * @param lang A string representing the language to set. Defaults to 'en' if no value is passed.
   */
  public setLanguage(lang: string = 'en') {
    // Call tryCatchHelper to handle any errors that occur within this method's function body.
    // this.tryCatchHelper(() => {
    //   // Use the '$chatwoot' global object to call its 'setLocale' function and pass in the desired language.
    //   window.$chatwoot.setLocale(lang);
    // });
  }

  /**
   * This method sets the conversation custom attributes for Chatwoot.
   * It takes an object 'attributes' as a parameter, which defaults to an empty object if no value is passed.
   * Inside the method the '$chatwoot' global object is used to call its 'setConversationCustomAttributes' function.
   * This function receives the 'attributes' object and sets it as the conversation's custom attributes in Chatwoot.
   *
   * Example usage:
   * setConversationCustomAttributes({
   *   productName: "iPhone",
   *   productCategory: "Smartphone",
   * });
   */
  public setConversationCustomAttributes(attributes: {} = {}): void {
    // window.$chatwoot.setConversationCustomAttributes(attributes);
  }

  // More to implement
  // ref: https://www.chatwoot.com/docs/product/channels/live-chat/sdk/setup/

  // ================ Helper Function ================
  /**
   * This is a helper function that calls a given callback function and enhances it with try-catch logic.
   * If window.$chatwoot object exists, it attempts to call the callback function immediately.
   * Otherwise, it waits for the 'chatwoot:ready' event to be fired on the window object before calling the callback.
   *
   * @param callback A function to be called when either the $chatwoot object is found or when it becomes available.
   */
  private tryCatchHelper(callback: () => void = () => {}) {
    // Check if the $chatwoot object is already available
    if (window.$chatwoot) {
      try {
        // If yes, try to run the callback directly
        callback();
      } catch {
        // If there was an error running the callback, wait for the 'chatwoot:ready' event to fire
        window.addEventListener('chatwoot:ready', () => {
          callback();
        });
      }
    } else {
      // If the $chatwoot object is not yet available, wait for the 'chatwoot:ready' event to fire
      window.addEventListener('chatwoot:ready', () => {
        callback();
      });
    }
  }

  /**
   * This function generates an HMAC (hash-based message authentication code) for the given key and message.
   * It takes two string parameters: 'key' is the secret key used to generate the HMAC, while 'message' is the text or data to be authenticated.
   * The function first calculates the HMAC using the 'HmacSHA256' function from the CryptoJS library, with 'message' as the message and 'key' as the secret key.
   * It then converts the resulting HMAC to a hexadecimal string using the 'toString' method with 'enc.Hex' as its argument.
   * Finally, the function returns the hexadecimal representation of the HMAC.
   *
   * @param key The secret key used to generate the HMAC.
   * @param message The text or data to be authenticated.
   * @returns The hexadecimal string representation of the HMAC.
   */
  private generateHMAC(key: string, message: string): string {
    // Calculate the HMAC using the CryptoJS library
    const hmac = HmacSHA256(message, key);
    // Convert the HMAC to a hexadecimal string
    const hmacBase16 = hmac.toString(enc.Hex);
    // Return the hexadecimal representation of the HMAC
    return hmacBase16;
  }
}
