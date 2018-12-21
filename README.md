# Lake Afton Alexa Skill
Get information about hours, pricing, and scheduling from Lake Afton Public Observatory

### Contribute

This skill runs on Lambda and must be manually uploaded by an admin. sduncan@lakeafton.com is the current contact.

If you would like to contribute, feel free to submit any PRs you wish and we'll review it and get them live as soon as we can.

The existing handlers are:

* OpenClosed - returns the results (formatted a bit, for verbalization) from https://api.lakeafton.com/hours
* Pricing - returns the costs for admission
* Schedule - returns the current viewing list as-provided by https://api.lakeafton.com/schedule

If you'd like to add an Intent Handler, use one of the above ones as a template and enter in your own info as you wish. Be sure to include your handler function in the LAMBDA SETUP section of `index.js`, as an argument in the `.addRequestHandlers()` function, and also submit a list of keyphrases that should trigger your Intent.

For example, if you wanted to write a new Intent Handler that would read out a list of Widgets, it could look something like this:

```
const WidgetHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Widget'; // this must be the name of the Intent that has to be created by the admin, ideally whatever your Handler is named, but without the word 'Handler'
  },
  handle(handlerInput) {

    // speakOutput is what Alexa will read back to the user when this Intent is called
		const speakOutput = 'Widgets available are blue, green, and red'
		
    // reprompt is a bit confusing to me but I think it is basically Alexa trying to get you to finish your request, because she didn't hear you or you didn't say anything
    const repromptOutput = 'Do you have any more questions?'

		return handlerInput.responseBuilder
		.speak(speakOutput)
		.reprompt(repromptOutput)
		.getResponse()

	},
}

```

Then you would submit (in the PR text, or something) a list of phrases you think should trigger this Intent, such as:

* "what widgets do you have"
* "what color of widgets are there"
* "what color are your widgets"
* "do you have widgets"
