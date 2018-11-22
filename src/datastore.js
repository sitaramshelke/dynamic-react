export const code = `
  class Index extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      const data = [
        {
          name: "Tanner Linsley",
          age: 26,
          friend: {
            name: "Jason Maurer",
            age: 23
          }
        }
      ];

      const columns = [
        {
          Header: "Name",
          accessor: "name" // String-based value accessors!
        },
        {
          Header: "Age",
          accessor: "age",
          Cell: props => <span className="number">{props.value}</span> // Custom cell components!
        },
        {
          id: "friendName", // Required because our accessor is not a string
          Header: "Friend Name",
          accessor: d => d.friend.name // Custom value accessors!
        },
        {
          Header: props => <span>Friend Age</span>, // Custom header components!
          accessor: "friend.age"
        }
      ];

      return <ReactTable data={data} columns={columns} />;
    }
  }
  render(<Index />, document.getElementById("react-container"));
  `;

export const dependencies = ["ReactTable"];

