function render()
{
    var inputNode = document.getElementById("myInput") as HTMLTextAreaElement;
    var inputValue = inputNode.value;

    const music = new Note123.Music;
    music.render(inputValue);
}