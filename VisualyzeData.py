
import pandas as pd
import matplotlib.pyplot as plt
import plotly.express as px
import dash
from dash import dcc, html, dash_table
from dash.dependencies import Input, Output

# Read CSV data
data = pd.read_csv("salaries.csv")

# Create the line graph for job count per year

job_count_per_year = data.groupby('work_year').size().reset_index(name='job_count')

# Plotting the line graph using Plotly
fig = px.line(job_count_per_year, x='work_year', y='job_count', title='Number of Jobs from 2020 to 2024')

#  Dash app for interactive table
app = dash.Dash(__name__)

# Layout for the Dash app
app.layout = html.Div([
    dcc.Graph(id='line-graph', figure=fig), 
    html.Div(id='table-container', children=[
        html.H3("Click a year on the graph to see job titles and their counts"),
        dash_table.DataTable(id='job-table')  
    ])
])

# Callback to update the table based on the selected year
@app.callback(
    Output('job-table', 'data'),
    [Input('line-graph', 'clickData')]
)
def update_table(clickData):
    
    if clickData:
        year_clicked = clickData['points'][0]['x']
        
        filtered_data = data[data['work_year'] == year_clicked]
        
        aggregated_data = filtered_data.groupby('job_title').size().reset_index(name='count')
        return aggregated_data.to_dict('records') 
    return []

# Run app
if __name__ == '__main__':
    app.run_server(debug=True)

