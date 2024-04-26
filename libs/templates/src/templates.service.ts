import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplatesService {
  otpTemplate(otp) {
    return `<mjml>
        <mj-body background-color="#ffffff" font-size="13px">
          <mj-section background-color="#ffffff" padding-bottom="0px" padding-top="0">
            <mj-column vertical-align="top" width="100%">
             
            </mj-column>
          </mj-section>
          <mj-section background-color="#009FE3" vertical-align="top" padding-bottom="0px" padding-top="0">
            <mj-column vertical-align="top" width="100%">
              <mj-text align="left" color="#ffffff" font-size="30px" font-weight="bold" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px" padding-bottom="30px" padding-top="50px">SIGNUP VERIFICATION</mj-text>
            </mj-column>
          </mj-section>
          <mj-section background-color="#009fe3" padding-bottom="20px" padding-top="20px">
            <mj-column vertical-align="middle" width="100%">
              <mj-text align="left" color="#000000" font-size="22px" font-family="open Sans Helvetica, Arial, sans-serif" padding-left="25px" padding-right="25px">Your OTP for verification is: <br /><br /> <span style="color:#FEEB35">${otp}</span></mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>`;
  }
}
