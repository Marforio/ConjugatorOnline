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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var Scene01_Landing_vue_1 = require("./scenes/Scene01_Landing.vue");
var Scene02_Settings_vue_1 = require("./scenes/Scene02_Settings.vue");
var Scene03_Game_vue_1 = require("./scenes/Scene03_Game.vue");
var Scene04_Results_vue_1 = require("./scenes/Scene04_Results.vue");
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    data: function () {
        return {
            scenes: { Scene01_Landing: Scene01_Landing_vue_1.default, Scene02_Settings: Scene02_Settings_vue_1.default, Scene03_Game: Scene03_Game_vue_1.default, Scene04_Results: Scene04_Results_vue_1.default },
            currentScene: 'Scene01_Landing',
            gameSettings: null,
            results: null
        };
    },
    computed: {
        currentSceneComponent: function () {
            return this.scenes[this.currentScene];
        }
    },
    methods: {
        changeScene: function (sceneName) {
            if (this.scenes[sceneName]) {
                this.currentScene = sceneName;
            }
        },
        handleStartGame: function (selections) {
            console.log('Scene manager received Setting selections:', selections);
            this.gameSettings = (0, vue_1.markRaw)(selections);
            this.changeScene('Scene03_Game');
        },
        handleGameOver: function (results) {
            console.log('Game over, Game Manager received results:', results);
            this.results = results;
            this.changeScene('Scene04_Results');
        }
    }
});
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    var __VLS_ctx = {};
    var __VLS_components;
    var __VLS_directives;
    var __VLS_0 = ((__VLS_ctx.currentSceneComponent));
    // @ts-ignore
    var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign(__assign(__assign({ 'onChangeScene': {} }, { 'onStartGame': {} }), { 'onGameOver': {} }), { gameSettings: ((__VLS_ctx.gameSettings)), results: ((__VLS_ctx.results)) })));
    var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onChangeScene': {} }, { 'onStartGame': {} }), { 'onGameOver': {} }), { gameSettings: ((__VLS_ctx.gameSettings)), results: ((__VLS_ctx.results)) })], __VLS_functionalComponentArgsRest(__VLS_1), false));
    var __VLS_6 = {};
    var __VLS_7;
    var __VLS_8 = {
        onChangeScene: (__VLS_ctx.changeScene)
    };
    var __VLS_9 = {
        onStartGame: (__VLS_ctx.handleStartGame)
    };
    var __VLS_10 = {
        onGameOver: (__VLS_ctx.handleGameOver)
    };
    var __VLS_3;
    var __VLS_4;
    var __VLS_5;
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
