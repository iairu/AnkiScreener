using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Markup;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace AnkiScreener
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        MouseButton ActiveMouseBtn = MouseButton.XButton1; // Currently selecting using this button, default to unused XButton1 if not
        Point downPoint; // Selection start point
        Point movingPoint; // Selection end point
        Border drag; // Current selection/group control
        List<Border> selections = new List<Border>(); // All existing selections
        List<Border> groups = new List<Border>(); // All existing selection groups

        public MainWindow()
        {
            InitializeComponent();
        }

        // Events
        // Mouse Events
        private void eMouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left || e.ChangedButton == MouseButton.Right)
            {
                ActiveMouseBtn = e.ChangedButton;
                downPoint = e.GetPosition(this);

                // Duplicate defaultDragSelection or defaultDragGroup element
                drag = XamlReader.Parse(XamlWriter.Save((ActiveMouseBtn == MouseButton.Left) ? defaultDragSelection : defaultDragGroup)) as Border;
                // Set the X and Y coords using margin
                drag.Margin = new Thickness(downPoint.X, downPoint.Y, 0, 0);
                // Add the duplicate to view
                if (ActiveMouseBtn == MouseButton.Left) { selectionContainer.Children.Add(drag); } else { groupContainer.Children.Add(drag); }

                this.CaptureMouse();
            }
            e.Handled = true;
        }
        private void eMouseMove(object sender, MouseEventArgs e)
        {
            if (ActiveMouseBtn == MouseButton.Left || ActiveMouseBtn == MouseButton.Right)
            {
                movingPoint          = e.GetPosition(this);
                drag.Width     = (downPoint.X < movingPoint.X) ? movingPoint.X - downPoint.X : 0;
                drag.Height    = (downPoint.Y < movingPoint.Y) ? movingPoint.Y - downPoint.Y : 0;
            }
            e.Handled = true;
        }
        private void eMouseUp(object sender, MouseButtonEventArgs e)
        {
            // Cancel selection if no size, else add to selections for easy access
            if (ActiveMouseBtn == MouseButton.Left)
            {
                if (drag.Width == 0 || drag.Height == 0) { selectionContainer.Children.RemoveAt(selectionContainer.Children.Count - 1); }
                else { selections.Add(drag); }
            }
            else if (ActiveMouseBtn == MouseButton.Right)
            {
                if (drag.Width == 0 || drag.Height == 0) { groupContainer.Children.RemoveAt(groupContainer.Children.Count - 1); }
                else { groups.Add(drag); }
            }

            ActiveMouseBtn = MouseButton.XButton1;
            e.Handled = true;
        }
        // Keyboard Events
        private void eKeyDown(object sender, KeyEventArgs e)
        {
            switch(e.Key)
            {
                case Key.Escape:    Close();                    break;
                case Key.X:         removeLastSelection();      break;
                case Key.C:         removeLastGroup();          break;
                case Key.F1:        printDrags();               break;

                default: break;
            }
        }

        // Helper fncs.
        private void printDrags()
        {
            Debug.WriteLine("---- Printing Selections ----");
            selections.ForEach(selection => {
                Debug.WriteLine(
                    "[" + selection.Margin.Left +
                    ", " + selection.Margin.Top +
                    " | " + (selection.Margin.Left + selection.Width) +
                    ", " + (selection.Margin.Top + selection.Height) +
                    "]"
                    );
            });
            Debug.WriteLine("---- Printing Groups ----");
            groups.ForEach(selection => {
                Debug.WriteLine(
                    "[" + selection.Margin.Left +
                    ", " + selection.Margin.Top +
                    " | " + (selection.Margin.Left + selection.Width) +
                    ", " + (selection.Margin.Top + selection.Height) +
                    "]"
                    );
            });
            Debug.WriteLine("---- (Done) ----");
        }
        private void removeLastSelection()
        {
            if (selections.Count > 0)
            {
                selectionContainer.Children.RemoveAt(selectionContainer.Children.Count - 1);
                selections.RemoveAt(selections.Count - 1);
            }
        }
        private void removeLastGroup()
        {
            if (groups.Count > 0)
            {
                groupContainer.Children.RemoveAt(groupContainer.Children.Count - 1);
                groups.RemoveAt(groups.Count - 1);
            }
        }
    }
}
