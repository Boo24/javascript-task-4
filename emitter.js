'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */

/**
class SubscribeParticipantData {
    constructor(context, handler) {
        this.context = context;
        this.handlers = [handler];
    }

}
*/

function getAllEvents(event) {
    const currentEvents = event.split('.');
    const result = [];
    let currentEvent = '';
    for (let i = 0; i < currentEvents.length; i++) {
        if (i === 0) {
            currentEvent = currentEvents[i];
            result.push(currentEvent);
        } else {
            currentEvent = `${currentEvent}.${currentEvents[i]}`;
            result.push(currentEvent);
        }

    }

    return result.reverse();
}

function getEmitter() {
    const events = new Map();
    const eventsCount = new Map();

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            // console.info(event, context, handler);
            if (events.has(event)) {
                const currentEventData = events.get(event);
                if (currentEventData.has(context)) {
                    currentEventData.get(context).push(handler);
                } else {
                    currentEventData.set(context, [handler]);
                }
            } else {
                const eventMap = new Map([[context, [handler]]]);
                events.set(event, eventMap);
            }

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            if (!events.has(event)) {
                return this;
            }
            const eventMap = events.get(event);
            if (!eventMap.has(context)) {
                return this;
            }
            eventMap.delete(context);


            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const currentEvents = getAllEvents(event);
            for (const currEvent of currentEvents) {
                if (!events.has(currEvent)) {
                    continue;
                }
                if (eventsCount.has(currEvent)) {
                    eventsCount.set(currEvent, eventsCount.get(currEvent) + 1);
                } else {
                    eventsCount.set(currEvent, 1);
                }
                const emittedEvent = events.get(currEvent);
                emittedEvent.forEach(function (key, value) {
                    for (let x of key) {
                        x.call(value);
                    }

                });
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
