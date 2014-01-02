define(
    [
        'jquery'
        ,'moddef'
        ,'d3'

        ,'json!../../../data/energy.json'
        ,'json!../../../data/mass.json'
    ],
    function(
        $
        ,M
        ,d3

        ,dataEnergy
        ,dataMass
    ) {

        'use strict';

        function err( err ){
            console.error( err.toString() );
        }

        function pfx( str ){
            return Modernizr.prefixed( str ).replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
        }

        function log10(val) {
            return Math.log(val) / Math.LN10;
        }

        /**
         * Page-level Mediator
         * @module Boilerplate
         * @implements {Stapes}
         */
        var Mediator = M({

            /**
             * Mediator Constructor
             * @return {void}
             */
            constructor : function(){

                var self = this;

                self.min = 1e-23;
                self.max = 1e-8;
                self.height = 3000;

                self.initEvents();

                $(function(){
                    self.resolve('domready');
                });

                self.after('domready').then(function(){
                    self.onDomReady();
                }).otherwise( err );
            },

            /**
             * Initialize events
             * @return {void}
             */
            initEvents : function(){

                var self = this;
            },

            /**
             * DomReady Callback
             * @return {void}
             */
            onDomReady : function(){

                var self = this
                    ,wrap = $('#scale-wrap').height(self.height)
                    ,scaleEnergy = d3.scale.log()
                        .domain([ self.min, self.max ])
                        .range([0, self.height])
                    ,scaleMass = d3.scale.log()
                        .domain([ self.min * 1.11265006e-17, self.max * 1.11265006e-17 ])
                        .range([0, self.height])
                    ;

                self.elEnergy = d3.select('#scale-left');
                self.elMass = d3.select('#scale-right');

                self.placeAxis( self.elEnergy, scaleEnergy, 'left' );
                self.placeAxis( self.elMass, scaleMass, 'right' );

                self.placeMarkers( self.elEnergy, dataEnergy, scaleEnergy );
                self.placeMarkers( self.elMass, dataMass, scaleMass );

                wrap.removeClass('loading');
            },

            placeAxis : function( el, scale, orientation ){

                var self = this
                    ,svg = el.append('svg')
                    ,axis = d3.svg.axis()
                    ,width = 100
                    ,domain = scale.domain()
                    ;

                axis.scale( scale )
                    .orient( orientation || 'left' )
                    .tickFormat( function(n){
                        return (n / Math.pow(10, Math.floor(log10(n))) - 1) < 0.00001 ? Math.round(log10(n)) : '';
                    })
                    .innerTickSize( 4 )
                    // .outerTickSize( 20 )
                    ;
                svg.attr('class', 'axis')
                    .attr('width', width)
                    .attr('height', scale.range()[1])
                    .append('g')
                    .attr('transform', 'translate('+ (orientation === 'left' ? width - 1 : 1) +',30)')
                    .call( axis )
                    ;


            },

            placeMarkers : function( wrap, data, scale ){

                var self = this
                    ,markers
                    ,vals = data.map(function( el ){
                        return el[0];
                    })
                    ;

                
                markers = wrap.selectAll('.marker').data( data );

                markers.enter()
                    .append('div')
                    .attr('class', 'marker')
                    .style(pfx('transform'), function( d ){ return 'translate3d(0,'+scale( d[0] )+'px, 0)'; })
                    .append('label')
                        .text(function( d ){ return d.join(': '); })
                    ;

            }

        }, ['events']);

        return new Mediator();
    }
);




