function forgerMail(link){
    return`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
            }
    
            .verification-container {
                margin-top: 20px;
            }
    
            .otp {
                height: 100px;
                width: 150px;
                font-weight: bold;
                font-size: 24px;
                color: #007bff; /* Blue color for the OTP */
            }
        </style>
    </head>
    <body>
        <h1>Verification Code</h1>
        <p>Click on this button to go to forget password</p>
        <div class="verification-container">
            <button class="otp"><a href=${link} class="btn btn-primary" style="padding: 10px 15px; cusor: pointer; display: inline-block; border-radius: 5px; background: #87CEEB; color: black; text-decoration: none;">Reset Password</a></button> <!-- Replace with your actual OTP -->
        </div>
    </body>
    </html>
    `
}

module.exports = forgerMail
