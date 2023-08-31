// const mailchimp = require('@mailchimp/mailchimp_marketing');

// const apiKey = 'c05a2c15a3bdd1cc86a512db22b42995-us17';
// mailchimp.setConfig({
//   apiKey: apiKey,
//   server: 'us17', // The server prefix in your API key (e.g., "us5")
// });

// // ...

// async function sendWelcomeEmail(email, name) {
//   try {
//     // Create a segment in your Mailchimp list based on criteria (e.g., signup date)
//     const segmentResponse = await mailchimp.lists.createSegment(listId, {
//       name: 'New Signups',
//       options: {
//         match: 'all',
//         conditions: [
//           {
//             condition_type: 'Signup Date',
//             field: 'signup_date',
//             op: 'is',
//             value: 'within_last',
//             extra: '7d', // Within the last 7 days
//           },
//         ],
//       },
//     });

//     // Assuming segmentResponse.id contains the ID of the newly created segment
//     const segmentId = segmentResponse.id;

//     // Add the user's email to the segment
//     await mailchimp.lists.addSegmentMembers('LIST_ID', segmentId, {
//       members_to_add: [email],
//     });

//     // Now you can create and send the welcome email campaign
//     const campaignResponse = await mailchimp.campaigns.create({
//       type: 'regular',
//       recipients: {
//         list_id: 'LIST_ID',
//         segment_opts: {
//           saved_segment_id: segmentId,
//         },
//       },
//       // ... other campaign settings ...
//     });

//     // Set content for the campaign
//     await mailchimp.campaigns.setContent(campaignResponse.id, {
//       html: `<p>Welcome, ${name}! This is your welcome email.</p>`,
//     });

//     // Send the campaign
//     await mailchimp.campaigns.send(campaignResponse.id);

//     console.log('Welcome email campaign sent successfully:', campaignResponse);
//   } catch (error) {
//     console.error('Error sending welcome email campaign:', error);
//   }
// }

// // ...

// router.post('/users/signup', async (req, res) => {
//   const user = new User(req.body);
//   try {
//     await user.save();

//     // Send welcome email to the user
//     await sendWelcomeEmail(user.email, user.name);

//     // Add the user's email to the Mailchimp list and apply a segment
//     await addToMailchimpList(user.email);

//     const token = await user.generateAuthToken();
//     res.status(201).send({ user, token });
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // ...



// async function sendEmailCampaign(email,name) {
//   try {
//     const response = await mailchimp.campaigns.create({
//       type: 'regular', // or 'plaintext' or 'absplit'
//       recipients: {
//         list_id: '526bb4d0bb', // ID of the list/audience you want to send to
//       },
//       settings: {
//         subject_line: 'Welcome',
//         from_name: 'Prateek',
//         reply_to: 'prateek102004@gmail.com',
//       },
//     });

//     // Set content for the campaign
//     await mailchimp.campaigns.setContent(response.id, {
//       html: '<p>My first email</p>',
//     });

//     // Send the campaign
//     await mailchimp.campaigns.send(response.id);

//     console.log('Campaign sent successfully:', response);
//   } catch (error) {
//     console.error('Error sending campaign:', error);
//   }
// }

// // Call the function to send the campaign
// sendEmailCampaign();

  
// const sendWelcomeMail=(email,name)=>{
//   sendEmailCampaign(email,name)
// }


// const sgMail = require('@sendgrid/mail')

// const sendgridAPIKey = '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'

// sgMail.setApiKey(sendgridAPIKey)

// const sendWelcomeEmail = (email, name) => {
//     sgMail.send({
//         to: email,
//         from: 'prateek102004@gmail.com',
//         subject: 'Thanks for joining in!',
//         text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
//     })
// }

// const sendCancelationEmail = (email, name) => {
//     sgMail.send({
//         to: email,
//         from: 'prateek102004@gmail.com',
//         subject: 'Sorry to see you go!',
//         text: `Goodbye, ${name}. I hope to see you back sometime soon.`
//     })
// }
// sendWelcomeEmail('prateek102004@gmail.com','prateek')

// module.exports = {
//     sendWelcomeEmail,
//     sendCancelationEmail
// }