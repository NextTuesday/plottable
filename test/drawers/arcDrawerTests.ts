///<reference path="../testReference.ts" />

describe("Drawers", () => {
  describe("Arc Drawer", () => {
    it("getPixelPoint", () => {
      var svg = TestMethods.generateSVG(300, 300);
      var data = [{value: 10}, {value: 10}, {value: 10}, {value: 10}];
      var piePlot = new Plottable.Plots.Pie();

      var drawer = new Plottable.Drawers.Arc("one", piePlot);
      (<any> piePlot)._getDrawer = () => drawer;

      piePlot.addDataset("one", data);
      piePlot.valueAccessor((d) => d.value);
      piePlot.renderTo(svg);

      piePlot.getAllSelections().each(function (datum: any, index: number) {
        var pixelPoint = drawer._getPixelPoint(datum, index);
        var radius = 75;
        var angle = Math.PI / 4 + ((Math.PI * index) / 2);
        var expectedX = radius * Math.sin(angle);
        var expectedY = -radius * Math.cos(angle);
        assert.closeTo(pixelPoint.x, expectedX, 1, "x coordinate correct");
        assert.closeTo(pixelPoint.y, expectedY, 1, "y coordinate correct");
      });

      svg.remove();
    });
  });
});
