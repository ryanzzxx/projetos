from kivy.app import App
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.textinput import TextInput

class CalculatorApp(App):
    def build(self):
        self.operators = set(['+', '-', '*', '/'])
        self.last_was_operator = False

        layout = GridLayout(cols=4)

        self.result = TextInput(font_size=32, readonly=True, halign='right', size_hint=(1, 0.2))
        layout.add_widget(self.result)

        buttons = [
            ('7', '8', '9', '/'),
            ('4', '5', '6', '*'),
            ('1', '2', '3', '-'),
            ('C', '0', '=', '+')
        ]

        for row in buttons:
            for label in row:
                button = Button(text=label, pos_hint={'center_x': 0.5, 'center_y': 0.5})
                button.bind(on_press=self.on_button_press)
                layout.add_widget(button)

        return layout

    def on_button_press(self, instance):
        current = self.result.text
        button_text = instance.text

        if button_text == 'C':
            self.result.text = ''
            self.last_was_operator = False
        elif button_text == '=':
            try:
                expression = self.result.text
                self.result.text = str(eval(expression))
            except Exception:
                self.result.text = 'Error'
            self.last_was_operator = False
        else:
            if (button_text in self.operators) and self.last_was_operator:
                return
            if (button_text in self.operators) or (button_text == '.'):
                self.last_was_operator = True
            else:
                self.last_was_operator = False

            new_text = current + button_text
            self.result.text = new_text

if __name__ == '__main__':
    CalculatorApp().run()
