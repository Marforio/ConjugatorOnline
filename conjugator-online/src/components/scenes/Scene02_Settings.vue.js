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
Object.defineProperty(exports, "__esModule", { value: true });
var set_options_json_1 = require("@/assets/data/set_options.json");
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    data: function () {
        return {
            options: set_options_json_1.default,
            selectedVerbSet: '',
            selectedSentenceTypes: set_options_json_1.default.sentence_types,
            selectedTenses: set_options_json_1.default.tenses,
            numPrompts: 10
        };
    },
    methods: {
        goToScene: function (sceneName) {
            this.$emit('changeScene', sceneName);
        },
        startGame: function () {
            var selections = {
                verbSet: this.selectedVerbSet,
                sentenceTypes: this.selectedSentenceTypes,
                tenses: this.selectedTenses,
                numPrompts: this.numPrompts
            };
            console.log(selections);
            this.$emit('startGame', selections);
            this.goToScene('Scene03_Game');
        }
    }
}); /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    var __VLS_ctx = {};
    var __VLS_components;
    var __VLS_directives;
    ['settings-scene', 'settings-scene', 'settings-scene', 'checkbox-item',];
    // CSS variable injection 
    // CSS variable injection end 
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("settings-scene") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("d-flex flex-wrap align-items-center checkbox-container") }));
    for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.options.verb_sets)); _i < _a.length; _i++) {
        var set = _a[_i][0];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: ((set)) }, { class: ("form-check form-check-inline me-3") }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)(__assign({ class: ("form-check-input") }, { type: ("radio"), id: ((set)), value: ((set)) }));
        (__VLS_ctx.selectedVerbSet);
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: ("form-check-label") }, { for: ((set)) }));
        (set);
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("form-group") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("d-flex flex-wrap align-items-center checkbox-container") }));
    for (var _b = 0, _c = __VLS_getVForSourceType((__VLS_ctx.options.sentence_types)); _b < _c.length; _b++) {
        var type = _c[_b][0];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: ((type)) }, { class: ("form-check form-check-inline me-3") }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)(__assign({ class: ("form-check-input") }, { type: ("checkbox"), id: ((type)), value: ((type)) }));
        (__VLS_ctx.selectedSentenceTypes);
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: ("form-check-label") }, { for: ((type)) }));
        (type);
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("form-group") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("d-flex flex-wrap align-items-center checkbox-container") }));
    for (var _d = 0, _e = __VLS_getVForSourceType((__VLS_ctx.options.tenses)); _d < _e.length; _d++) {
        var tense = _e[_d][0];
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ key: ((tense)) }, { class: ("form-check form-check-inline me-3") }));
        __VLS_elementAsFunction(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)(__assign({ class: ("form-check-input") }, { type: ("checkbox"), id: ((tense)), value: ((tense)) }));
        (__VLS_ctx.selectedTenses);
        __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: ("form-check-label") }, { for: ((tense)) }));
        (tense);
    }
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: ("form-group") }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
        for: ("numPrompts"),
    });
    __VLS_elementAsFunction(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)(__assign(__assign({ id: ("numPrompts"), type: ("number"), min: ("3"), max: ("50") }, { class: ("form-control") }), { required: (true) }));
    (__VLS_ctx.numPrompts);
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.startGame) }));
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.goToScene('Scene01_Landing');
        } }));
    ['settings-scene', 'd-flex', 'flex-wrap', 'align-items-center', 'checkbox-container', 'form-check', 'form-check-inline', 'me-3', 'form-check-input', 'form-check-label', 'form-group', 'd-flex', 'flex-wrap', 'align-items-center', 'checkbox-container', 'form-check', 'form-check-inline', 'me-3', 'form-check-input', 'form-check-label', 'form-group', 'd-flex', 'flex-wrap', 'align-items-center', 'checkbox-container', 'form-check', 'form-check-inline', 'me-3', 'form-check-input', 'form-check-label', 'form-group', 'form-control',];
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
