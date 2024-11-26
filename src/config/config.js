// config.js

// Base default configuration that applies to all routes
const BASE_DEFAULTS = {
    layout: '',
    viewport_layout: 'volume',   // 'volume' or 'stack'
    title: '',
    details: null,
    files: [],
    iec: null,
    iecs: [],
    nifti: false,

    // left Panel
    // ----------------------------------
    leftPanelVisible: false,

    // -- files panel
    filesPanelVisible: false,

    // -- tools panel
    toolsPanelVisible: false,

    viewToolGroupVisible: false,
    viewToolGroupValue: 'volume', // 'volume' or 'projection' or 'stack'
    viewToolVolumeVisible: false,
    viewToolProjectionVisible: false,
    viewToolStackVisible: false,

    functionToolGroupVisible: false,
    functionToolGroupValue: 'mask', // 'mask' or 'blackout' or 'slice-remove'
    functionToolMaskVisible: false,
    functionToolBlackoutVisible: false,
    functionToolSliceRemoveVisible: false,

    formToolGroupVisible: false,
    formToolGroupValue: 'cylinder', // 'cuboid' or 'cylinder'
    formToolCuboidVisible: false,
    formToolCylinderVisible: false,

    leftClickToolGroupVisible: false,
    leftClickToolGroupValue: 'selection', // 'selection' or 'windowlevel' or 'crosshairs'
    leftClickToolWindowLevelVisible: false,
    leftClickToolCrossHairsVisible: false,
    leftClickToolRectangleScissorsVisible: false,

    rightClickToolGroupVisible: false,
    rightClickToolGroupValue: 'zoom', // 'zoom' or 'pan'
    rightClickToolZoomVisible: false,
    rightClickToolPanVisible: false,

    opacityToolVisible: false,
    opacityToolMin: 0,
    opacityToolMax: 1,
    opacityToolStep: 0.01,
    opacityToolValue: 0.3,

    presetToolVisible: false,
    presetToolList: [],
    presetToolValue: 'CT-MIP',

    resetViewportsVisible: false,
    resetViewportsValue: false,

    // right panel
    // ----------------------------------
    rightPanelVisible: false,

    // -- description panel
    descriptionPanelVisible: false,

    // top panel
    // ----------------------------------
    topPanelVisible: false,

    // -- navigation panel
    navigationPanelVisible: false,
    // -- search panel
    searchPanelVisible: false,

    // bottom panel
    // ----------------------------------
    bottomPanelVisible: false,

    // -- masker panel
    maskerPanelVisible: false,
    maskerPanelExpandSelectionVisible: false,
    maskerPanelClearSelectionVisible: false,
    maskerPanelAcceptSelectionVisible: false,

    // -- masker review panel
    maskerReviewPanelVisible: false,
    maskerReviewPanelAcceptedVisible: false,
    maskerReviewPanelRejectedVisible: false,
    maskerReviewPanelSkipVisible: false,
    maskerReviewPanelNonMaskableVisible: false,

    // -- visual review panel
    visualReviewPanelVisible: false,
    visualReviewPanelGoodVisible: false,
    visualReviewPanelBadVisible: false,
    visualReviewPanelBlankVisible: false,
    visualReviewPanelScoutVisible: false,
    visualReviewPanelOtherVisible: false,
    visualReviewPanelFlagVisible: false,

};

// Extend base configuration with route-specific overrides
export const TASK_CONFIGS = {
    default: { ...BASE_DEFAULTS },

    masker_image: {
        ...BASE_DEFAULTS,

        layout: 'Masker',
        viewport_layout: 'stack',
        title: 'Image Masker',

        // left Panel
        // ----------------------------------
        leftPanelVisible: true,

        // -- tools panel
        toolsPanelVisible: true,

        functionToolGroupVisible: true,
        functionToolGroupValue: 'blackout',
        functionToolBlackoutVisible: true,

        formToolGroupVisible: true,
        formToolGroupValue: 'cuboid',
        formToolCuboidVisible: true,

        leftClickToolGroupVisible: true,
        leftClickToolGroupValue: 'selection',
        leftClickToolWindowLevelVisible: true,
        leftClickToolRectangleScissorsVisible: true,

        rightClickToolGroupVisible: true,
        rightClickToolGroupValue: 'zoom',
        rightClickToolZoomVisible: true,
        rightClickToolPanVisible: true,

        resetViewportsVisible: true,

        // right panel
        // ----------------------------------
        rightPanelVisible: false,

        // -- description panel
        descriptionPanelVisible: true,

        // bottom panel
        // ----------------------------------
        bottomPanelVisible: true,

        // -- masker panel
        maskerPanelVisible: true,
        maskerPanelClearSelectionVisible: true,
        maskerPanelAcceptSelectionVisible: true,
    },

    masker_volume: {
        ...BASE_DEFAULTS,
        layout: 'Masker',
        title: 'Volume Masker',

        // left Panel
        // ----------------------------------
        leftPanelVisible: true,

        // -- tools panel
        toolsPanelVisible: true,

        viewToolGroupVisible: true,
        viewToolGroupValue: 'volume',
        viewToolVolumeVisible: true,
        viewToolProjectionVisible: true,

        functionToolGroupVisible: true,
        functionToolGroupValue: 'mask',
        functionToolMaskVisible: true,
        functionToolBlackoutVisible: true,
        functionToolSliceRemoveVisible: true,

        formToolGroupVisible: true,
        formToolGroupValue: 'cylinder',
        formToolCuboidVisible: true,
        formToolCylinderVisible: true,

        leftClickToolGroupVisible: true,
        leftClickToolGroupValue: 'selection',
        leftClickToolWindowLevelVisible: true,
        leftClickToolCrossHairsVisible: true,
        leftClickToolRectangleScissorsVisible: true,

        rightClickToolGroupVisible: true,
        rightClickToolGroupValue: 'zoom',
        rightClickToolZoomVisible: true,
        rightClickToolPanVisible: true,

        opacityToolVisible: true,
        opacityToolMin: 0,
        opacityToolMax: 1,
        opacityToolStep: 0.01,
        opacityToolValue: 0.3,

        presetToolVisible: true,
        presetToolList: [],
        presetToolValue: 'CT-MIP',

        resetViewportsVisible: true,

        // right panel
        // ----------------------------------
        rightPanelVisible: false,

        // -- description panel
        descriptionPanelVisible: true,

        // bottom panel
        // ----------------------------------
        bottomPanelVisible: true,

        // -- masker panel
        maskerPanelVisible: true,
        maskerPanelExpandSelectionVisible: true,
        maskerPanelClearSelectionVisible: true,
        maskerPanelAcceptSelectionVisible: true,

    },

    masker_review_image: {
        ...BASE_DEFAULTS,
        layout: 'MaskerReview',
        viewport_layout: 'stack',
        title: 'Image Masker Review',

        // left Panel
        // ----------------------------------
        leftPanelVisible: true,

        // -- tools panel
        toolsPanelVisible: true,

        leftClickToolGroupVisible: true,
        leftClickToolGroupValue: 'windowlevel',
        leftClickToolWindowLevelVisible: true,

        rightClickToolGroupVisible: true,
        rightClickToolGroupValue: 'zoom',
        rightClickToolZoomVisible: true,
        rightClickToolPanVisible: true,

        resetViewportsVisible: true,

        // right panel
        // ----------------------------------
        rightPanelVisible: false,

        // -- description panel
        descriptionPanelVisible: true,

        // bottom panel
        // ----------------------------------
        bottomPanelVisible: true,

        // -- masker review panel
        maskerReviewPanelVisible: true,
        maskerReviewPanelAcceptedVisible: true,
        maskerReviewPanelRejectedVisible: true,
        maskerReviewPanelSkipVisible: true,
        maskerReviewPanelNonMaskableVisible: true,
    },

    masker_review_volume: {
        ...BASE_DEFAULTS,
        layout: 'MaskerReview',
        title: 'Volume Masker Review',

        // left Panel
        // ----------------------------------
        leftPanelVisible: true,

        // -- tools panel
        toolsPanelVisible: true,

        viewToolGroupVisible: true,
        viewToolGroupValue: 'volume',
        viewToolVolumeVisible: true,
        viewToolProjectionVisible: true,

        leftClickToolGroupVisible: true,
        leftClickToolGroupValue: 'windowlevel',
        leftClickToolWindowLevelVisible: true,

        rightClickToolGroupVisible: true,
        rightClickToolGroupValue: 'zoom',
        rightClickToolZoomVisible: true,
        rightClickToolPanVisible: true,

        opacityToolVisible: true,
        opacityToolMin: 0,
        opacityToolMax: 1,
        opacityToolStep: 0.01,
        opacityToolValue: 0.3,

        presetToolVisible: true,
        presetToolList: [],
        presetToolValue: 'CT-MIP',

        resetViewportsVisible: true,

        // right panel
        // ----------------------------------
        rightPanelVisible: false,

        // -- description panel
        descriptionPanelVisible: true,

        // bottom panel
        // ----------------------------------
        bottomPanelVisible: true,

        // -- masker review panel
        maskerReviewPanelVisible: true,
        maskerReviewPanelAcceptedVisible: true,
        maskerReviewPanelRejectedVisible: true,
        maskerReviewPanelSkipVisible: true,
        maskerReviewPanelNonMaskableVisible: true,
    },

    nifti_review: {
        ...BASE_DEFAULTS,
        layout: 'NiftiReview',
        title: 'NIfTI Review',
        nifti: true,

        // left Panel
        // ----------------------------------
        leftPanelVisible: true,

        // -- files panel
        filesPanelVisible: false,

        // -- tools panel
        toolsPanelVisible: true,

        viewToolGroupVisible: true,
        viewToolGroupValue: 'projection',
        viewToolVolumeVisible: true,
        viewToolProjectionVisible: true,

        leftClickToolGroupVisible: true,
        leftClickToolGroupValue: 'windowlevel',
        leftClickToolWindowLevelVisible: true,
        leftClickToolCrossHairsVisible: true,

        rightClickToolGroupVisible: true,
        rightClickToolGroupValue: 'zoom',
        rightClickToolZoomVisible: true,
        rightClickToolPanVisible: true,

        opacityToolVisible: true,
        opacityToolMin: 0,
        opacityToolMax: 1,
        opacityToolStep: 0.01,
        opacityToolValue: 0.3,

        presetToolVisible: true,
        presetToolList: [],
        presetToolValue: 'MR-Default',

        resetViewportsVisible: true,

        // right panel
        // ----------------------------------
        rightPanelVisible: true,

        // -- description panel
        descriptionPanelVisible: true,

        // bottom panel
        // ----------------------------------
        bottomPanelVisible: true,

        // -- visual review panel
        visualReviewPanelVisible: true,
        visualReviewPanelGoodVisible: true,
        visualReviewPanelBadVisible: true,
        visualReviewPanelBlankVisible: true,
        visualReviewPanelScoutVisible: true,
        visualReviewPanelOtherVisible: true,
        //visualReviewPanelFlagVisible: true,
    },

    dicom_review_image: {
        ...BASE_DEFAULTS,
        layout: 'DicomReview',
        viewport_layout: 'stack',
        title: 'DICOM Image Review',

        // left Panel
        // ----------------------------------
        leftPanelVisible: true,

        // -- files panel
        filesPanelVisible: false,

        // -- tools panel
        toolsPanelVisible: true,

        leftClickToolGroupVisible: true,
        leftClickToolGroupValue: 'windowlevel',
        leftClickToolWindowLevelVisible: true,

        rightClickToolGroupVisible: true,
        rightClickToolGroupValue: 'zoom',
        rightClickToolZoomVisible: true,
        rightClickToolPanVisible: true,

        resetViewportsVisible: true,

        // right panel
        // ----------------------------------
        rightPanelVisible: true,

        // -- description panel
        descriptionPanelVisible: true,

        // bottom panel
        // ----------------------------------
        bottomPanelVisible: true,

        // -- visual review panel
        visualReviewPanelVisible: true,
        visualReviewPanelGoodVisible: true,
        visualReviewPanelBadVisible: true,
        visualReviewPanelBlankVisible: true,
        visualReviewPanelScoutVisible: true,
        visualReviewPanelOtherVisible: true,
        visualReviewPanelFlagVisible: true,
    },

    dicom_review_volume: {
        ...BASE_DEFAULTS,
        layout: 'DicomReview',
        title: 'DICOM Volume Review',

        // left Panel
        // ----------------------------------
        leftPanelVisible: true,

        // -- files panel
        filesPanelVisible: false,

        // -- tools panel
        toolsPanelVisible: true,

        viewToolGroupVisible: true,
        viewToolGroupValue: 'projection',
        viewToolVolumeVisible: true,
        viewToolProjectionVisible: true,

        leftClickToolGroupVisible: true,
        leftClickToolGroupValue: 'windowlevel',
        leftClickToolWindowLevelVisible: true,
        leftClickToolCrossHairsVisible: true,

        rightClickToolGroupVisible: true,
        rightClickToolGroupValue: 'zoom',
        rightClickToolZoomVisible: true,
        rightClickToolPanVisible: true,

        opacityToolVisible: true,
        opacityToolMin: 0,
        opacityToolMax: 1,
        opacityToolStep: 0.01,
        opacityToolValue: 0.3,

        presetToolVisible: true,
        presetToolList: [],

        resetViewportsVisible: true,

        // right panel
        // ----------------------------------
        rightPanelVisible: true,

        // -- description panel
        descriptionPanelVisible: true,

        // bottom panel
        // ----------------------------------
        bottomPanelVisible: true,

        // -- visual review panel
        visualReviewPanelVisible: true,
        visualReviewPanelGoodVisible: true,
        visualReviewPanelBadVisible: true,
        visualReviewPanelBlankVisible: true,
        visualReviewPanelScoutVisible: true,
        visualReviewPanelOtherVisible: true,
        visualReviewPanelFlagVisible: true,
    },

};
