(function() {

  angular.module('VideoApp.commons')
  .provider('formatFileSizeFilter', function () {
    var $config = {
      // Byte units following the IEC format
      // http://en.wikipedia.org/wiki/Kilobyte
      units: [
        { size: 1000000000, suffix: ' GB' },
        { size: 1000000, suffix: ' MB' },
        { size: 1000, suffix: ' KB' }
      ]
    };

    this.defaults = $config;

    this.$get = function () {
      return function (bytes) {
        if (!angular.isNumber(bytes)) {
          return '';
        }
        var unit = true,
          i = 0,
          prefix,
          suffix;

        while (unit) {
          unit = $config.units[i];
          prefix = unit.prefix || '';
          suffix = unit.suffix || '';
          if (i === $config.units.length - 1 || bytes >= unit.size) {
            return prefix + (bytes / unit.size).toFixed(2) + suffix;
          }
          i += 1;
        }
      };
    };
  });

})();
