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
    constructor(handler, currentCount, maxCount, through) {
        this.handlers = [handler];
        this.currentCount = 0;
        this.maxCount = maxCount;
        this.through = through;
    }
}

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

    return {


        on: function (event, context, handler,
            intervalData = { 'maxCount': Infinity, 'through': 1 }) {
            // console.info(event, context, handler);
            if (events.has(event)) {
                const currentEventData = events.get(event);
                if (currentEventData.has(context)) {
                    currentEventData.get(context).handlers.push(handler);
                } else {
                    currentEventData.set(context, new SubscriberData(handler, 0,
                        intervalData.maxCount, intervalData.through));
                }
            } else {
                const eventMap = new Map([[context, new SubscriberData(handler, 0,
                    intervalData.maxCount, intervalData.through)]]);
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
                emittedEvent.forEach(function (key, value) {
                    for (let x of key.handlers) {
                        key.currentCount += 1;
                        if (key.currentCount - 1 >= key.maxCount ||
                            (key.currentCount % key.through !== 1 && key.through !== 1)) {
                            break;
                        }
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
            this.on(event, context, handler, { 'maxCount': times, 'through': 1 });

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
            this.on(event, context, handler, { 'maxCount': Infinity, 'through': frequency });

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
