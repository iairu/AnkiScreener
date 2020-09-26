using System;
using System.Collections.Generic;
using System.Windows.Controls;
using System.Windows.Markup;
using System.Text;

namespace AnkiScreener
{
    class Helpers
    {
        public Border CloneBorder(Border xamlNode) {
            return XamlReader.Parse(XamlWriter.Save(xamlNode)) as Border;
        }

        private void removeLastBorder()
        {
            // if (selections.Count > 0)
            // {
            //     selectionContainer.Children.RemoveAt(selectionContainer.Children.Count - 1);
            //     selections.RemoveAt(selections.Count - 1);
            // }
        }
    }
}
