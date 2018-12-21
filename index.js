'use strict'
const Alexa = require('ask-sdk')
const request = require('request-promise')
const skillBuilder = Alexa.SkillBuilders.standard()
const responses = require('./responses')
console.log(responses)

const skillAttributes = {
	SKILL_NAME: 'Lake Afton Public Observatory',
	WELCOME_MESSAGE: 'You can ask me if Lake Afton is open, or what we are viewing in the telescope, or what the admission fee is.',
	WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
	DISPLAY_CARD_TITLE: 'Lake Afton Public Observatory',
	HELP_MESSAGE: 'You can ask me if Lake Afton is open, or what we are viewing in the telescope, or what the admission fee is.',
	HELP_REPROMPT: 'What can I help you with?',
	STOP_MESSAGE: 'Goodbye!'
}

/* INTENT HANDLERS */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()

    // const item = requestAttributes.t(getRandomItem(Object.keys(responses)))
		const item = responses.test

    const speakOutput = 'Thanks for your interest in Lake Afton Public Observatory. How can I help you?'
    const repromptOutput = 'How can I help you?'

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes)

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse()
  },
}

const OpenClosedHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'OpenClosed';
  },
  async handle(handlerInput) {

		const response = await request('http://api.lakeafton.com/hours', { json: true }, (err, res, body) => {
			if (err) { return console.log(err); }
			return body
		})

		const speakOutput = 'The observatory is currently open Fridays and Saturdays from ' + response.hours.open + ' to ' + response.hours.close
		const repromptOutput = 'The observatory is currently open Fridays and Saturdays from ' + response.hours.open + ' to ' + response.hours.close

		return handlerInput.responseBuilder
		.speak(speakOutput)
		.reprompt(repromptOutput)
		.getResponse()

	},
}

const PricingHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Pricing';
  },
  handle(handlerInput) {

		const speakOutput = 'Admission is eight dollars for adults, four dollars for children under thirteen, or twenty dollars for a family. Children under five are free. Yearly memberships are twenty four dollars for adults, twelve dollars for children under thirteen, or sixty dollars for a family.'
		const repromptOutput = 'Admission is eight dollars for adults, four dollars for children under thirteen, or twenty dollars for a family. Children under five are free. Yearly memberships are twenty four dollars for adults, twelve dollars for children under thirteen, or sixty dollars for a family.'

		return handlerInput.responseBuilder
		.speak(speakOutput)
		.reprompt(repromptOutput)
		.getResponse()

	},
}

const ScheduleHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Schedule';
  },
  async handle(handlerInput) {

		const response = await request('http://api.lakeafton.com/schedule', { json: true }, (err, res, body) => {
			if (err) { return console.log(err); }
			return body
		})

		const speakOutput = response.schedule
		const repromptOutput = response.schedule

		return handlerInput.responseBuilder
		.speak(speakOutput)
		.reprompt(repromptOutput)
		.getResponse()

	},
}

const HelpHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()

    sessionAttributes.speakOutput = HELP_MESSAGE
    sessionAttributes.repromptSpeech = HELP_REPROMPT

    return handlerInput.responseBuilder
      .speak(sessionAttributes.speakOutput)
      .reprompt(sessionAttributes.repromptSpeech)
      .getResponse()
  },
}

const RepeatHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent'
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes()

    return handlerInput.responseBuilder
      .speak(sessionAttributes.speakOutput)
      .reprompt(sessionAttributes.repromptSpeech)
      .getResponse()
  },
}

const ExitHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent')
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes()
    const speakOutput = requestAttributes.t('STOP_MESSAGE', requestAttributes.t('SKILL_NAME'))

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse()
  },
}

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler")
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`)
    return handlerInput.responseBuilder.getResponse()
  },
}


const ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`)

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse()
  },
}

/* LAMBDA SETUP */
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
		OpenClosedHandler,
		PricingHandler,
		ScheduleHandler,
    HelpHandler,
    RepeatHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda()
