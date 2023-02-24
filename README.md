
# Lightweight clone of google form with nextjs
---
#### demo video: https://youtu.be/YccNnOZ80BE
This project cloned Basic features that google form provides, including
1. Form making
- Support 6 types of question, can be easily extended to more question types.
- Support rich text editor to style question descriptions.
- Support basic form operations includes add/delete/copy questions, adding/deleting options, options swapping with easy-to-use drag-and-drop bar.
2. Response statistics
- Summary page
    - Show overall submission status of each question, presented with beautiful charts.
    - Charts can be easily copied to clipboard and be used to anywhere you want.
- Question page
    - Show detailed submissions for each question.
- Individual page
    - Show each individual submission.
    - Support deletion of each submission.
3. Form settings
- Support several basic settings for the form
    - Option of whether collect email addresses
    - Option of whether limits each email address to only one response
    - Option of whether shuffle the question order
    - Customized confirmation message
4. Form send
- Support two ways to send forms
    - By sending emails to destinated email address with customized content
    - By getting the direct url link
5. Form Response
- Easy to switch account within the response page
- Email confirmation message after response has been successfully recorded.
6. Main page
- Show all the forms created by the account, sorted by last modified date
    - Each form contains a thumbnail image that makes user easily identifies each form.
    - Support form rename and deletion on the main page, allows a more convenient way to arrange forms.
