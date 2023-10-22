// function forgerMail(link){
//     return`<!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Verification Code</title>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 text-align: center;
//             }
    
//             .verification-container {
//                 margin-top: 20px;
//             }
    
//             .otp {
//                 height: 100px;
//                 width: 150px;
//                 font-weight: bold;
//                 font-size: 24px;
//                 color: #007bff; /* Blue color for the OTP */
//             }
//         </style>
//     </head>
//     <body>
//         <h1>Verification Code</h1>
//         <p>Click on this button to go to forget password</p>
//         <div class="verification-container">
//             <p class="otp"><a href=${link} style="padding: 10px 15px; cusor: pointer; display: inline-block; border-radius: 5px; background: #87CEEB; color: black; text-decoration: none;">Reset Password</a></p> <!-- Replace with your actual OTP -->
//         </div>
//     </body>
//     </html>
//     `
// }

// module.exports = forgerMail



function forgetMail(link) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
      body {
        background: linear-gradient(90deg, orange, white);
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
  
      .container {
        max-width: 400px;
        padding: 40px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }
  
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
  
      .header h1 {
        font-size: 36px;
        color: orange;
        margin: 0;
      }
  
      .slogan {
        font-size: 18px;
        text-align: center;
        margin-top: 0;
      }
  
      .reset-button {
        display: block;
        width: 100%;
        max-width: 200px; /* Reduced button width */
        background-color: orange;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 10px; /* Reduced button padding */
        font-size: 16px;
        text-align: center;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin: 0 auto; /* Center the button */
      }
  
      .reset-button:hover {
        background-color: #444;
      }
  
      .key-symbol {
        display: block;
        text-align: center;
        font-size: 48px;
        margin-bottom: 20px;
        color: orange;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="key-symbol">
        &#128272; <!-- Unicode for the key symbol -->
      </div>
     
      <h1>Hello ,</h1>
      <p>It seems you have requested to reset your password. Click the button below to proceed:</p>
      <a class="reset-button" style=" cursor: pointer;" href=${link}>Reset Password</a>
     
      
    </div>
  </body>
  </html>
   `;
  }
  
  module.exports = forgetMail