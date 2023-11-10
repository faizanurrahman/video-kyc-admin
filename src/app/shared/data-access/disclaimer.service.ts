import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { SweetAlertService } from '../../core/services/sweet-alert.service';

@Injectable({
  providedIn: 'root',
})
export class DisclaimerService {
  constructor(private swalService: SweetAlertService) {}

  showDisclaimerPopup(title: string, cancelButton: boolean = false) {
    return this.swalService.info(title, '', {
      html: `

      <p>By clicking <code>Agree and Proceed</code> to Application, you acknowledge that you have read and understood the below disclaimer and agree to its terms.</p>

      <ol class="disclaimer-container text-start d-flex flex-column gap-3 mt-5 text-dark">
  <li>
    This website is for informational purposes only and is not intended to provide specific
    commercial, financial, investment, accounting, tax, or legal advice. It is provided to you
    solely for your own personal, non-commercial use and not for purposes of resale, distribution,
    public display or performance, or any other uses by you in any form or manner whatsoever. Unless
    otherwise indicated on this website, you may display, download, archive, and print a single copy
    of any information on this website, or otherwise distributed from CEDA, for such personal,
    non-commercial use, provided it is done pursuant to the User Conduct and Obligations set forth
    herein.
  </li>

  <li>
    While we have taken care to ensure that the content on this website is accurate, this website
    and the services accessible on or via this website are provided "as is" and your use of and
    reliance on the information on this website and the online services is entirely at your own
    risk. Accordingly, we do not guarantee the accuracy, timeliness, reliability or completeness of
    any of the information contained on, downloaded or accessed from this website.
  </li>

  <li>
    We do not represent or warrant that the website, any tools (such as calculators), software,
    advice, opinion, statement, information, content or online services will be error-free or will
    meet any particular criteria of accuracy, completeness, reliability, performance or quality. You
    acknowledge that any reliance upon any such tools, software, advice, opinion, statement or
    information shall be at your sole risk. We reserve the right, in our sole discretion, to correct
    any errors or omissions in any portion of this website.
  </li>

  <li>
    Information, ideas and opinions expressed on this website should not be regarded as professional
    advice or our official opinion. You are strongly advised to seek professional advice before
    taking any course of action related to them. More specifically, certain information such as
    share price data, interest rates and exchange rates constitute guidelines only and the provision
    of this data may be delayed for a period of time. Accordingly, you are strongly advised to
    consult us or your professional adviser before trading or acting on such information.
  </li>

  <li>
    To the fullest extent permissible by law, we expressly disclaim all (express and implied)
    warranties, including, without limitation, warranties of merchantability, title, and fitness for
    a particular purpose, non-infringement, compatibility, security and accuracy in respect of this
    website and the services accessible on this website. While we take all reasonable precautions to
    prevent this, we do not warrant that the website or any software available for download via the
    website is free of viruses or destructive code.
  </li>

  <li>
    We and our officers, directors, employees, servants, affiliates, shareholders, agents,
    consultants or employees (in whose favour this constitutes a stipulation for the benefit of
    another) shall not be liable for and you hereby indemnify us and our officers, directors,
    employees, servants, affiliates, shareholders, agents, consultants or employees (in whose favour
    this constitutes a stipulation for the benefit of another) against any direct, indirect,
    special, incidental, consequential or punitive damages or loss of any kind whatsoever or
    howsoever caused (whether arising under contract, delict or otherwise and whether the loss was
    actually foreseen or reasonably foreseeable) arising out of your use of this website or the
    online services or the information contained on this website or your inability to use this
    website or the online services.
  </li>

  <li>
    Without derogating from the generality of the above, we will not be liable for

    <ul>
      <li>
        Any interruption, malfunction, downtime or other failure of the website or online services,
        our system, databases or any of its components, for reasons beyond our control;
      </li>
      <li>
        Any loss or damage with regard to customer data or other data directly or indirectly caused
        by malfunction of our system, third party systems, power failures, unlawful access to or
        theft of data, computer viruses or destructive code on our system or third party systems;
        programming defects;
      </li>
      <li>
        Any interruption, malfunction, downtime or other failure of goods or services provided by
        third parties, including, without limitation, third party systems such as the public
        switched telecommunication service providers, internet service providers, electricity
        suppliers, local authorities and certification authorities;
      </li>
      <li>Any event over which we have no direct control.</li>
    </ul>
  </li>

  <li>
    CEDA reserves the right, at its sole discretion, to modify, disable access to or discontinue,
    temporarily or permanently, any part or all of this website or any information contained thereon
    without liability or notice to you.
  </li>
</ol>




              `,
      position: 'center',
      //   showClass: {
      //     popup: `
      //   animate__animated
      //   animate__fadeInRight
      //   animate__faster
      // `,
      //   },
      //   hideClass: {
      //     popup: `
      //   animate__animated
      //   animate__fadeOutRight
      //   animate__faster
      // `,
      //   },
      // grow: 'column',
      width: 'clamp(400px, 100%, 700px)',
      heightAuto: false,
      // showCloseButton: true,
      showCancelButton: cancelButton,
      focusConfirm: false,
      focusCancel: false,
      confirmButtonText: 'Agree and Proceed',
      confirmButtonAriaLabel: 'Agree and Proceed',
      customClass: {
        container: 'swal2-custom-container-disclaimer',
        popup: 'swal2-custom-popup-disclaimer',
        htmlContainer: 'swal2-custom-html-container-disclaimer',
        actions: 'swal2-custom-actions-disclaimer',
        confirmButton: 'swal2-custom-confirm-button-disclaimer',
        icon: 'swal2-custom-icon-disclaimer',
        title: 'swal2-custom-title-disclaimer',
        footer: 'swal2-custom-footer-disclaimer',
      },
      backdrop: false,
    });
  }

  showLoanApplicationDisclaimer(cancelButton: boolean = false) {
    return Swal.fire({
      title: 'Loan Application Disclaimer',
      icon: 'info',
      heightAuto: false,

      html: `

      <p>By clicking <code>Agree and Proceed</code> to Application, you acknowledge that you have read and understood the below disclaimer and agree to its terms.</p>

      <ol class="disclaimer-container text-start d-flex flex-column gap-3 mt-5 text-dark">
  <li>
    This website is for informational purposes only and is not intended to provide specific
    commercial, financial, investment, accounting, tax, or legal advice. It is provided to you
    solely for your own personal, non-commercial use and not for purposes of resale, distribution,
    public display or performance, or any other uses by you in any form or manner whatsoever. Unless
    otherwise indicated on this website, you may display, download, archive, and print a single copy
    of any information on this website, or otherwise distributed from CEDA, for such personal,
    non-commercial use, provided it is done pursuant to the User Conduct and Obligations set forth
    herein.
  </li>

  <li>
    While we have taken care to ensure that the content on this website is accurate, this website
    and the services accessible on or via this website are provided "as is" and your use of and
    reliance on the information on this website and the online services is entirely at your own
    risk. Accordingly, we do not guarantee the accuracy, timeliness, reliability or completeness of
    any of the information contained on, downloaded or accessed from this website.
  </li>

  <li>
    We do not represent or warrant that the website, any tools (such as calculators), software,
    advice, opinion, statement, information, content or online services will be error-free or will
    meet any particular criteria of accuracy, completeness, reliability, performance or quality. You
    acknowledge that any reliance upon any such tools, software, advice, opinion, statement or
    information shall be at your sole risk. We reserve the right, in our sole discretion, to correct
    any errors or omissions in any portion of this website.
  </li>

  <li>
    Information, ideas and opinions expressed on this website should not be regarded as professional
    advice or our official opinion. You are strongly advised to seek professional advice before
    taking any course of action related to them. More specifically, certain information such as
    share price data, interest rates and exchange rates constitute guidelines only and the provision
    of this data may be delayed for a period of time. Accordingly, you are strongly advised to
    consult us or your professional adviser before trading or acting on such information.
  </li>

  <li>
    To the fullest extent permissible by law, we expressly disclaim all (express and implied)
    warranties, including, without limitation, warranties of merchantability, title, and fitness for
    a particular purpose, non-infringement, compatibility, security and accuracy in respect of this
    website and the services accessible on this website. While we take all reasonable precautions to
    prevent this, we do not warrant that the website or any software available for download via the
    website is free of viruses or destructive code.
  </li>

  <li>
    We and our officers, directors, employees, servants, affiliates, shareholders, agents,
    consultants or employees (in whose favour this constitutes a stipulation for the benefit of
    another) shall not be liable for and you hereby indemnify us and our officers, directors,
    employees, servants, affiliates, shareholders, agents, consultants or employees (in whose favour
    this constitutes a stipulation for the benefit of another) against any direct, indirect,
    special, incidental, consequential or punitive damages or loss of any kind whatsoever or
    howsoever caused (whether arising under contract, delict or otherwise and whether the loss was
    actually foreseen or reasonably foreseeable) arising out of your use of this website or the
    online services or the information contained on this website or your inability to use this
    website or the online services.
  </li>

  <li>
    Without derogating from the generality of the above, we will not be liable for

    <ul>
      <li>
        Any interruption, malfunction, downtime or other failure of the website or online services,
        our system, databases or any of its components, for reasons beyond our control;
      </li>
      <li>
        Any loss or damage with regard to customer data or other data directly or indirectly caused
        by malfunction of our system, third party systems, power failures, unlawful access to or
        theft of data, computer viruses or destructive code on our system or third party systems;
        programming defects;
      </li>
      <li>
        Any interruption, malfunction, downtime or other failure of goods or services provided by
        third parties, including, without limitation, third party systems such as the public
        switched telecommunication service providers, internet service providers, electricity
        suppliers, local authorities and certification authorities;
      </li>
      <li>Any event over which we have no direct control.</li>
    </ul>
  </li>

  <li>
    CEDA reserves the right, at its sole discretion, to modify, disable access to or discontinue,
    temporarily or permanently, any part or all of this website or any information contained thereon
    without liability or notice to you.
  </li>
</ol>




              `,
      position: 'center',
      //   showClass: {
      //     popup: `
      //   animate__animated
      //   animate__fadeInRight
      //   animate__faster
      // `,
      //   },
      //   hideClass: {
      //     popup: `
      //   animate__animated
      //   animate__fadeOutRight
      //   animate__faster
      // `,
      //   },
      // grow: 'column',
      width: 700,
      // showCloseButton: true,
      showCancelButton: cancelButton,
      focusConfirm: false,
      focusCancel: false,
      confirmButtonText: 'Agree and Proceed',
      confirmButtonAriaLabel: 'Agree and Proceed',
      customClass: {
        container: 'swal2-custom-container-disclaimer',
        popup: 'swal2-custom-popup-disclaimer',
        htmlContainer: 'swal2-custom-html-container-disclaimer',
        actions: 'swal2-custom-actions-disclaimer',
        confirmButton: 'swal2-custom-confirm-button-disclaimer',
        icon: 'swal2-custom-icon-disclaimer',
        title: 'swal2-custom-title-disclaimer',
        footer: 'swal2-custom-footer-disclaimer',
      },
      backdrop: false,
    }) as Promise<SweetAlertResult>;
  }

  // <style>
  //            p {
  //             text-align: start;
  //            }

  //            li:not(.list-group-item) {
  //             text-align: start;
  //            }
  //           </style>
  showLoanPaymentDisclaimer(title: string, cancelButton: boolean = false) {
    return Swal.fire({
      heightAuto: false,
      html: `

      <style>
             p {
              text-align: start;
             }

             li:not(.list-group-item) {
              text-align: start;
             }

             /* Custom CSS for Terms and Conditions */
/* Custom CSS for Nested Lists with Specific Numbering */
.premium-list {
    list-style-type: none;
    counter-reset: section;
    padding-left: 0;
}

.premium-list > li {
    margin: 10px 0;
}

.premium-list > li:before {
    counter-increment: section;
    content: counters(section, ".") " ";
}

.premium-list > li > ol {
    list-style-type: none;
    counter-reset: subsection;
    padding-left: 20px;
}

.premium-list > li > ol > li {
    margin: 10px 0;
}

.premium-list > li > ol > li:before {
    counter-increment: subsection;
    content: counters(section, ".") "." counters(subsection, ".") " ";
}

.premium-list > li > ol > li >  ol, .premium-list > li > ol > li + ol {
    list-style-type: lower-alpha;

    padding-left: 20px;
}

.premium-list > li > ol > li > ol > li {
    margin: 10px 0;
}

// .premium-list > li > ol > li > ol > li:before {
//     counter-increment: subsubsection;
//     content: counters(section, ".") "." counters(subsection, "a") "." counters(subsubsection, "a") " ";
// }


            </style>


      <div class="container mt-5">
        <h1 class="text-center">Terms and Conditions of Use</h1>
        <p class="text-center">Kindly be advised that these terms and conditions constitute a legal agreement between you as the user of our website and us as Citizen Entrepreneurial Development Agency (CEDA).</p>

        <ol class="premium-list">
        <li>Introduction
            <ol>
                <li>These terms and conditions shall govern your use of our website.</li>
                <li>By using our website, you accept these terms and conditions in full; accordingly, if you disagree with these terms and conditions or any part of these terms and conditions, you must not use our website.</li>
                <li>If you register with our website, submit any material to our website or use any of our website services, we will ask you to expressly agree to these terms and conditions.</li>
            </ol>
        </li>

        <li>License to use website
            <ol>
                <li>You may:
                    <ol>
                        <li>View active loan statement online</li>
                        <li>Process loan payments online</li>
                        <li>Download and print pages from our website.</li>
                        <li>Upload documents</li>
                    </ol>
                </li>
                <li>Except as expressly permitted by Section 2.1 or the other provisions of these terms and conditions, you must not download any material from our website or save any such material to your computer.</li>
                <li>You may only use our website for reasons agreed to in this agreement and for nothing else.</li>
                <li>Except as expressly permitted by these terms and conditions, you must not edit or otherwise modify any material on our website.</li>
                <li>Unless you own or control the relevant rights in the material, you must not:</li>
                <ol>
                    <li>Republish material from our website (including republication on another website);</li>
                    <li>Sell, rent or sub-license material from our website;</li>
                    <li>Show any material from our website in public;</li>
                    <li>Exploit material from our website for a commercial purpose; or</li>
                    <li>Redistribute material from our website.</li>
                </ol>
                <li>We reserve the right to restrict access to areas of our website, or indeed our whole website, at our discretion; you must not circumvent or bypass, or attempt to circumvent or bypass, any access restriction measures on our website.</li>
            </ol>
        </li>

        <li>Acceptable use
            <ol>
                <li>You must not:
                    <ol>
                        <li>use our website in any way or take any action that causes, or may cause, damage to the website or impairment of the performance, availability or accessibility of the website;</li>
                        <li>use our website in any way that is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity;</li>
                        <li>use our website to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm or other malicious computer software;</li>
                        <li>conduct any systematic or automated data collection activities (including without limitation scraping, data mining, data extraction and data harvesting) on or in relation to our website without our express written consent;</li>
                    </ol>
                </li>
                <li>You must ensure that all the information you supply to us through our website, or in relation to our website, is true, accurate, current, complete and non-misleading.</li>
            </ol>
        </li>

        <li>Your content
            <ol>
                <li>In these terms and conditions, "your content" means all information that you submit to us or our website for storage or publication on, processing by, or transmission via, our website.</li>
                <li>You grant to us permission to use, reproduce, store, adapt, publish, translate and distribute your content in any existing or future media OR reproduce, store and publish your content on and in relation to this website and any successor website.</li>
                <li>You grant to us the right to bring an action for infringement of the rights licensed under Section 3.</li>
                <li>You hereby waive all your moral rights in your content to the maximum extent permitted by applicable law; and you warrant and represent that all other moral rights in your content have been waived to the maximum extent permitted by applicable law.</li>
                <li>You may edit your content to the extent permitted using the editing functionality made available on our website.</li>
                <li>Without prejudice to our other rights under these terms and conditions, if you breach any provision of these terms and conditions in any way, or if we reasonably suspect that you have breached these terms and conditions in any way, we may delete, un-publish or edit any or all of your content.</li>
            </ol>
        </li>

        <li>Representations
            <ol>
                <li>You warrant and represent that your content will comply with these terms and conditions.</li>
                <li>Your content must not be illegal or unlawful, must not infringe any person's legal rights, and must not be capable of giving rise to legal action against any person (in each case in any jurisdiction and under any applicable law).</li>
                <li>Your content, and the use of your content by us in accordance with these terms and conditions, must not:</li>
                <ol>
                    <li>be libelous or maliciously false;</li>
                    <li>infringe any copyright, moral right, database right, trademark right, design right, right in passing off, or other intellectual property right;</li>
                    <li>infringe any right of confidence, right of privacy or right under data protection legislation;</li>
                    <li>constitute negligent advice or contain any negligent statement;</li>
                    <li>constitute an incitement to commit a crime (instructions for the commission of a crime or the promotion of criminal activity);</li>
                    <li>be in contempt of any court, or in breach of any court order;</li>
                    <li>be in breach of racial or religious hatred or discrimination legislation;</li>
                    <li>be blasphemous;</li>
                    <li>be untrue, false, inaccurate or misleading;</li>
                    <li>consist of or contain any instructions, advice or other information which may be acted upon and could, if acted upon, cause illness, injury or death, or any other loss or damage;</li>
                </ol>
            </ol>
        </li>

        <li>Limitations and exclusions of liability
            <ol>
                <li>Nothing in these terms and conditions will:
                    <ol>
                        <li>limit or exclude any liability for death or personal injury resulting from negligence;</li>
                        <li>limit or exclude any liability for fraud or fraudulent misrepresentation;</li>
                        <li>limit any liabilities in any way that is not permitted under applicable law;</li>
                    </ol>
                </li>
                <li>We will not be liable to you in respect of any losses arising out of any event or events beyond our reasonable control.</li>
                <li>We will not be liable to you in respect of any business losses, including (without limitation) loss of or damage to profits, income, revenue, use, production, anticipated savings, business, contracts, commercial opportunities or goodwill.</li>
                <li>We will not be liable to you in respect of any loss or corruption of any data, database or software.</li>
                <li>We will not be liable to you in respect of any special, indirect or consequential loss or damage.</li>
                <li>You accept that we have an interest in limiting the personal liability of our officers and employees and, having regard to that interest, you acknowledge that we are a limited liability entity; you agree that you will not bring any claim personally against our officers or employees in respect of any losses you suffer in connection with the website or these terms and conditions.</li>
            </ol>
        </li>

        <li>Limited warranties
            <ol>
                <li>We do not warrant or represent:
                    <ol>
                        <li>the completeness or accuracy of the information published on our website;</li>
                        <li>that the material on the website is up to date; or</li>
                        <li>that the website or any service on the website will remain available.</li>
                    </ol>
                </li>
            </ol>
        </li>

        <li>Breaches of these terms and conditions
            <ol>
                <li>Without prejudice to our other rights under these terms and conditions, if you breach these terms and conditions in any way, or if we reasonably suspect that you have breached these terms and conditions in any way, we may:
                    <ol>
                        <li>send you one or more formal warnings;</li>
                        <li>temporarily suspend your access to our website;</li>
                        <li>permanently prohibit you from accessing our website;</li>
                        <li>commence legal action against you, whether for breach of contract or otherwise; and/or</li>
                    </ol>
                </li>
            </ol>
        </li>

        <li>Variation
            <ol>
                <li>We may revise these terms and conditions from time to time.</li>
                <li>If you have given your express agreement to these terms and conditions, we will ask for your express agreement to any revision of these terms and conditions; and if you do not give your express agreement to the revised terms and conditions within such period as we may specify, we will take this to be consent of the new terms.</li>
            </ol>
        </li>

        <li>Assignment
            <ol>
                <li>You hereby agree that we may assign, transfer, sub-contract or otherwise deal with our rights and/or obligations under these terms and conditions.</li>
                <li>You may not without our prior written consent assign, transfer, subcontract or otherwise deal with any of your rights and/or obligations under these terms and conditions.</li>
            </ol>
        </li>

        <li>Severability
            <ol>
                <li>If a provision of these terms and conditions is determined by any court or other competent authority to be unlawful and/or unenforceable, the other provisions will continue in effect.</li>
                <li>If any unlawful and/or unenforceable provision of these terms and conditions would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision will continue in effect.</li>
            </ol>
        </li>

        <li>Third party rights
            <ol>
                <li>A contract under these terms and conditions is for our benefit and your benefit, and is not intended to benefit or be enforceable by any third party.</li>
                <li>The exercise of the parties' rights under a contract under these terms and conditions is not subject to the consent of any third party.</li>
            </ol>
        </li>

        <li>Notification
            <ol>
                <li>Kindly take note that CEDA reserves the right to send notifications to users through various platforms including but not limited to email and SMS.</li>
            </ol>
        </li>

        <li>Entire agreement
            <ol>
                <li>Subject to Section 12.1, these terms and conditions, together with (our privacy policy), shall constitute the entire agreement between you and us in relation to your use of our website and shall supersede all previous agreements between you and us in relation to your use of our website.</li>
            </ol>
        </li>

        <li>Law and jurisdiction
            <ol>
                <li>These terms and conditions shall be governed by and construed in accordance with the law of the Republic of Botswana.</li>
                <li>Any disputes relating to these terms and conditions shall be subject to the jurisdiction of the courts of Botswana.</li>
            </ol>
        </li>
    </ol>




        <h1 class="text-center">Refund Policy</h1>
        <p class="text-center badge badge-info">General</p>
        <p class="text-center">Refunds will be treated on a case by case basis and are guided by the Citizen Entrepreneurial Development Agency Terms and Conditions as per loan agreements.</p>
        <p class="text-center">All these terms are to the sole discretion of the Citizen Entrepreneurial Development Agency.</p>
    </div>
      `,
      position: 'center',
      width: 700,
      showCancelButton: cancelButton,
      focusConfirm: false,
      focusCancel: false,
      confirmButtonText: 'Agree and Proceed',
      confirmButtonAriaLabel: 'Agree and Proceed',
      customClass: {
        container: 'swal2-custom-container-disclaimer',
        popup: 'swal2-custom-popup-disclaimer ',
        htmlContainer: 'swal2-custom-html-container-disclaimer m-0',
        actions: 'swal2-custom-actions-disclaimer',
        confirmButton: 'swal2-custom-confirm-button-disclaimer',
        icon: 'swal2-custom-icon-disclaimer',
        title: 'swal2-custom-title-disclaimer',
        footer: 'swal2-custom-footer-disclaimer',
      },
      backdrop: false,
    });
  }
}
