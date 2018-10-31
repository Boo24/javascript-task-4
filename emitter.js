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

class SubscriberData {
    constructor(handler, optionalParams) {
        this.handlers = [handler];
        this.currentCount = 0;
        this.maxCount = optionalParams.maxCount;
        this.through = optionalParams.through;
    }
}

function getAllEvents(event) {
    const currentEvents = event.split('.');
    const result = [];
    let currentEvent = '';
    for (let i = 0; i < currentEvents.length; i++) {
        if (i === 0) {
            currentEvent = currentEvents[i];
        } else {
            currentEvent = `${currentEvent}.${currentEvents[i]}`;
        }
        result.push(currentEvent);

    }

    return result.reverse();
}
function mustSubscribe(subscriberData) {
    return !(subscriberData.currentCount - 1 >= subscriberData.maxCount ||
        (subscriberData.currentCount % subscriberData.through !== 1 &&
            subscriberData.through !== 1));
}

function createOptionalParams(maxCount, through) {
    return { maxCount, through };
}

function getEmitter() {
    const events = new Map();

    return {


        on: function (event, context, handler, options = createOptionalParams(Infinity, 1)) {
            if (events.has(event)) {
                const currentEventData = events.get(event);
                if (currentEventData.has(context)) {
                    currentEventData.get(context).handlers.push(handler);
                } else {
                    currentEventData.set(context, new SubscriberData(handler, options));
                }
            } else {
                const eventMap = new Map([[context, new SubscriberData(handler, options)]]);
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
            const eventToDelete = [...events.keys()]
                .filter(x => x === event || x.startsWith(event + '.'));
            for (let currEvent of eventToDelete) {
                if (!events.has(currEvent)) {
                    return this;
                }
                const eventMap = events.get(currEvent);
                if (!eventMap.has(context)) {
                    return this;
                }
                eventMap.delete(context);
            }


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
                const emittedEvent = events.get(currEvent);
                emittedEvent.forEach(function (subscriberData, subscriber) {
                    for (let handler of subscriberData.handlers) {
                        subscriberData.currentCount += 1;
                        if (!mustSubscribe(subscriberData)) {
                            break;
                        }
                        handler.call(subscriber);
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
            this.on(event, context, handler, createOptionalParams(times, 1));

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
            this.on(event, context, handler, createOptionalParams(Infinity, frequency));

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
