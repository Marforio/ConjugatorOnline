"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = require("@/assets/scripts/Game");
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    props: ['gameSettings'],
    data: function () {
        return {
            userName: 'Player', // Replace with actual user name if available
            game: null,
            gameStarted: false,
            currentPrompt: {
                person: '',
                verb: '',
                tense: '',
                sentenceType: ''
            },
            userAnswer: '',
            overallTimer: 0,
            roundTimer: 0,
            rightCount: 0,
            wrongCount: 0,
            remainingCount: this.gameSettings.numPrompts,
            promptCounter: 0,
            submitButtontext: 'SUBMIT',
            results: {},
            startTime: null,
            intervalId: null,
            roundStartTime: null,
            roundIntervalId: null,
        };
    },
    mounted: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.game = new Game_1.default(this.gameSettings);
                this.game.start();
                return [2 /*return*/];
            });
        });
    },
    beforeDestroy: function () {
        clearInterval(this.timerInterval);
        clearInterval(this.intervalId); // Clear the overall timer interval
        clearInterval(this.roundIntervalId); // Clear the round timer interval
    },
    methods: {
        goBack: function () {
            this.$emit('changeScene', 'Scene02_Settings');
        },
        endGame: function () {
            this.results = this.game.getResults();
            this.$emit('gameOver', this.results);
            this.endTimer();
        },
        quitGame: function () {
            this.$emit('changeScene', 'Scene01_Landing');
        },
        startGame: function () {
            this.gameStarted = true;
            this.startTime = new Date().getTime();
            this.roundStartTime = new Date().getTime();
            this.timerInterval = setInterval(this.updateTimers, 1000);
            this.updatePrompt();
        },
        updatePrompt: function () {
            var prompt = this.game.getCurrentPrompt();
            this.currentPrompt.person = prompt.getPerson();
            this.currentPrompt.verb = prompt.getVerb();
            this.currentPrompt.tense = prompt.getTense();
            this.currentPrompt.sentenceType = prompt.getSentenceType();
            this.startRoundTimer();
        },
        updateTimers: function () {
            var now = new Date().getTime();
            this.overallTimer = Math.floor((now - this.startTime) / 1000);
        },
        endTimer: function () {
            clearInterval(this.intervalId);
        },
        startRoundTimer: function () {
            var _this = this;
            this.roundStartTime = new Date().getTime(); // Reset round start time
            this.roundTimer = 0; // Reset the round timer display
            clearInterval(this.roundIntervalId); // Clear any existing interval
            this.roundIntervalId = setInterval(function () {
                var now = new Date().getTime();
                _this.roundTimer = Math.floor((now - _this.roundStartTime) / 1000);
            }, 1000);
        },
        endRoundTimer: function () {
            clearInterval(this.roundIntervalId);
        },
        submitAnswer: function () {
            var isCorrect = this.game.submitAnswer(this.userAnswer);
            if (isCorrect) {
                this.rightCount = this.game.getRightCount();
            }
            else {
                this.wrongCount = this.game.getWrongCount();
            }
            this.promptCounter++;
            this.remainingCount--;
            this.userAnswer = '';
            // End the current round timer
            this.endRoundTimer();
            if (this.remainingCount === 1) {
                this.submitButtontext = 'FINISH';
            }
            if (this.remainingCount === 0) {
                console.log(this.game.getResults());
                this.endGame();
            }
            else {
                this.game.nextPrompt();
                this.updatePrompt();
                // Start a new round timer
                this.startRoundTimer();
            }
        }
    }
});
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    var __VLS_ctx = {};
    var __VLS_components;
    var __VLS_directives;
    ['buttons',];
    // CSS variable injection 
    // CSS variable injection end 
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("game-scene") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("sidebar") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("settings-summary") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.userName);
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.gameSettings.verbSet);
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.gameSettings.sentenceTypes.join(', '));
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.gameSettings.tenses.join(', '));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("timers") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.roundTimer);
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.overallTimer);
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.rightCount);
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.wrongCount);
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.remainingCount);
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.promptCounter);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("buttons") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.goBack) }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.quitGame) }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("workspace") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("prompts") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("prompt") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.currentPrompt.person);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("prompt") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.currentPrompt.verb);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("prompt") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.currentPrompt.tense);
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("prompt") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.currentPrompt.sentenceType);
    if (!__VLS_ctx.gameStarted) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.startGame) }));
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
        __VLS_elementAsFunction(__VLS_intrinsicElements.input)(__assign({ onKeyup: (__VLS_ctx.submitAnswer) }));
        (__VLS_ctx.userAnswer);
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.submitAnswer) }));
        (__VLS_ctx.submitButtontext);
    }
    ['game-scene', 'sidebar', 'settings-summary', 'timers', 'buttons', 'workspace', 'prompts', 'prompt', 'prompt', 'prompt', 'prompt',];
    var __VLS_slots;
    var $slots;
    var __VLS_inheritedAttrs;
    var $attrs;
    var __VLS_refs = {};
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
var __VLS_self;
